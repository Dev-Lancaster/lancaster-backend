const fetch = require("node-fetch");
const ErrorServices = require("../admin/ErrorService");
const mail = require("../../middleware/mail");
const usuarioService = require("../admin/UsuarioService");
const { UserShop } = require("../../models/userShop");
const { OrdenCompra } = require("../../models/ordenCompra");
const { Producto } = require("../../models/producto");
const api =
  "https://api.nubefact.com/api/v1/08732aed-16ff-435a-89e5-a73c450ae468";

async function despachado(idOrden) {
  const orden = await OrdenCompra.findById(idOrden);
  const DESPACHADO = "DESPACHADO";
  const NO_DESPACHADO = "NO DESPACHADO";
  if (orden) {
    if (!orden.despachado) orden.despachado = DESPACHADO;
    else if (orden.despachado && orden.despachado === DESPACHADO)
      orden.despachado = NO_DESPACHADO;
    else if (orden.despachado && orden.despachado === NO_DESPACHADO)
      orden.despachado = DESPACHADO;

    await orden.save();
    return orden;
  }
}

async function errorNubefact(idOrden, body) {
  await OrdenCompra.findByIdAndUpdate(idOrden, {
    errorNubefact: true,
    textoErrorNubefact: body.errors,
  });
  const orden = await OrdenCompra.findById(idOrden);
  await sendMailErrorFactura(orden);
}

async function sendMailErrorFactura(orden) {
  try {
    const subject =
      "Se ha generado un error en la orden de compra de tipo: " +
      orden.tipoOrden;
    const text = `Buen dia,<br/> Se ha generado un error en la orden de compra de tipo <strong>${orden.tipoOrden}</strong> del usuario <strong>${orden.customerDetails.firstname} ${orden.customerDetails.lastname}</strong> equivalente a un valor de: <strong>S/ ${orden.totalAmount}</strong>.<br/> Para ver mas detalles ingrese al sistema.`;

    const user = await usuarioService.findRecibe();
    if (user) await mail.sendMail(user.correo, subject, text);
  } catch (e) {
    console.error(e);
  }
}

async function sendMailFacturado(orden) {
  try {
    const subject =
      "Se ha generado una orden de compra de tipo: " + orden.tipoOrden;
    const text = `Buen dia,<br/> Se ha generado una nueva orden de compra de tipo <strong>${orden.tipoOrden}</strong> del usuario <strong>${orden.customerDetails.firstname} ${orden.customerDetails.lastname}</strong> equivalente a un valor de: <strong>S/ ${orden.totalAmount}</strong>.<br/> Para ver mas detalles ingrese al sistema.`;

    const user = await usuarioService.findRecibe();
    if (user) await mail.sendMail(user.correo, subject, text);
  } catch (e) {
    console.error(e);
  }
}

async function existUserShop(email) {
  const emailLowerCase = email.toLowerCase();
  const model = await UserShop.findOne({ email: emailLowerCase }).lean();
  if (model) return { flag: true, model: model };
  else return { flag: false };
}

async function generateOrdenado(model) {
  try {
    if (model.mailRegister) {
      const resultValidUser = await existUserShop(model.mailRegister);
      if (!resultValidUser.flag)
        return {
          type: "ERROR",
          message: "El usuario que desea comprar no esta registrado",
          orden: null,
        };
      else model.userShop = resultValidUser.model._id;
    }

    let codigo;
    if (model.tipo === "FTV1") codigo = await generateCodigo();
    else codigo = await generateCodigoBoleta();

    const resultNubeFact = await getCodeNubeFact(codigo, model.tipo);
    await ErrorServices.save(
      "generateOrdenado - Linea: 88 - resultNubeFact",
      resultNubeFact &&
        resultNubeFact.type &&
        resultNubeFact.type + "-" + resultNubeFact &&
        resultNubeFact.code &&
        resultNubeFact.code
    );
    if (resultNubeFact.type === "ERROR")
      return {
        type: "ERROR",
        message: "Ha ocurrido un error al generar el codigo de facturacion",
        orden: null,
      };

    model.nubefactNumero = resultNubeFact.code;
    model.status = "ORDENADO";
    model.id = resultNubeFact.code;
    model.orderId = "LNC-" + resultNubeFact.code;
    model.date = new Date();
    model.tipoOrden = model.tipo === "FTV1" ? "FACTURA" : "BOLETA";

    if (model.customerDetails && model.customerDetails._id === "")
      delete model.customerDetails["_id"];

    let orden = new OrdenCompra(model);
    orden = await orden.save();
    return { type: "SUCCESS", orden: orden, message: "" };
  } catch (e) {
    console.error(e);
    await ErrorServices.save("generateOrdenado - Linea: 111", e.message);
    return { type: "ERROR", orden: orden, message: "" };
  }
}

async function generatePagado(id, model) {
  if (model.culquiToken) {
    model.status = "PAGADO";
    await OrdenCompra.findByIdAndUpdate(id, model);
    await changeInventario(model.products);
    const orden = await OrdenCompra.findById(id);
    return { type: "SUCCESS", orden: orden, message: "" };
  } else
    return {
      type: "ERROR",
      orden: null,
      message: "No se pudo generar la orden de pago",
    };
}

async function generateFacturado(id, model) {
  model.status = "FACTURADO";
  await OrdenCompra.findByIdAndUpdate(id, model);
  const result = await OrdenCompra.findById(id);
  return { type: "SUCCESS", orden: result, message: "" };
}

async function changeInventario(productos) {
  let producto, nuevaCantidad;
  for (const model of productos) {
    producto = await Producto.findById(model.producto);
    nuevaCantidad = producto.cantidad - model.cantidad;
    await Producto.findByIdAndUpdate(model.producto, {
      cantidad: nuevaCantidad,
    });
  }
}

async function generateCodigo() {
  const model = await OrdenCompra.findOne().sort({ id: -1 }).lean();
  if (!model) return 7;
  else if (!model.id) return 7;
  let codigo = model.id;
  if (codigo < 7) return 7;
  return codigo + 1;
}

async function generateCodigoBoleta() {
  const model = await OrdenCompra.findOne().sort({ idBoleta: -1 }).lean();
  if (!model) return 912;
  else if (!model.idBoleta) return 912;
  let codigo = model.idBoleta;
  if (codigo < 912) return 912;
  return codigo + 1;
}

async function getCodeNubeFact(code, tipo) {
  if (!code) return { type: "ERROR" };
  if (isNaN(code)) return { type: "ERROR" };

  let newCode = code;
  let validFlag = true;
  let result;

  while (validFlag) {
    try {
      result = await validateNubeFact(newCode, tipo);
    } catch (e) {
      console.error(e);
      await ErrorServices.save("getCodeNubeFact - Linea: 75", e);
      return { type: "ERROR" };
    }

    if (result && result.errors && result.codigo && result.codigo === 21)
      return { type: "ERROR" };
    else if (result && result.numero) newCode = newCode + 1;
    else if (result && result.errors && result.codigo && result.codigo === 24)
      return { type: "SUCCESS", code: newCode };
  }
  return { type: "ERROR" };
}

async function validateNubeFact(code, tipo) {
  let tipoComprobante = tipo === "FTV1" ? "1" : "2";

  const body = {
    operacion: "consultar_comprobante",
    tipo_de_comprobante: tipoComprobante,
    serie: tipo,
    numero: code,
  };

  //FTV1 = 1
  //BTV1 = 2

  const response = await fetch(api, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Authorization:
        "Bearer 439aef5bc96540059e854ab3a9e09256a9789c6637504b5eadbf183ce6504947",
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}

async function prepareFactura(body) {
  const response = await fetch(api, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Authorization:
        "Bearer 439aef5bc96540059e854ab3a9e09256a9789c6637504b5eadbf183ce6504947",
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}

async function findAll() {
  const result = await OrdenCompra.find()
    .sort({ tipoOrden: 1, date: -1 })
    .lean();

  let list = [];
  let productos = [];
  let productoModel;
  let userShop;

  for (let model of result) {
    productos = [];
    for (const p of model.products) {
      productoModel = await Producto.findById(p.producto);
      if (productoModel)
        productos.push({
          ...p,
          nombreProducto: productoModel.nombre,
          categoriaPadre: productoModel.categoriaNombre,
          categoriaHija: productoModel.categoriaHijaNombre,
        });
    }

    model.productos = productos;

    if (model.userShop) {
      userShop = await UserShop.findById(model.userShop);
      model.customerDetails = userShop;
      model.tipoUsuario = "REGISTRADO";
    } else model.tipoUsuario = "NO REGISTRADO";

    list.push({ ...model });
  }
  return list;
}

async function findById(id) {
  return await OrdenCompra.findById(id);
}

async function updateNubefactBody(id, body) {
  try {
    await OrdenCompra.findByIdAndUpdate(id, { bodyNubefact: body });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

exports.generateOrdenado = generateOrdenado;
exports.generatePagado = generatePagado;
exports.generateFacturado = generateFacturado;
exports.validateNubeFact = validateNubeFact;
exports.getCodeNubeFact = getCodeNubeFact;
exports.prepareFactura = prepareFactura;
exports.findAll = findAll;
exports.existUserShop = existUserShop;
exports.sendMailFacturado = sendMailFacturado;
exports.findById = findById;
exports.updateNubefactBody = updateNubefactBody;
exports.errorNubefact = errorNubefact;
exports.despachado = despachado;
