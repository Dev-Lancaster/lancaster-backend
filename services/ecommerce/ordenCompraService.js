const fetch = require("node-fetch");
const ErrorServices = require("../admin/ErrorService");
const { OrdenCompra } = require("../../models/ordenCompra");
const { Producto } = require("../../models/producto");
const api =
  "https://api.nubefact.com/api/v1/08732aed-16ff-435a-89e5-a73c450ae468";

async function generateOrdenado(model) {
  const codigo = await generateCodigo();
  const resultNubeFact = await getCodeNubeFact(codigo, model.tipo);

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

  let orden = new OrdenCompra(model);
  orden = await orden.save();
  return { type: "SUCCESS", orden: orden, message: "" };
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
  if (!model) return 9;
  return model.id + 1;
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
      await ErrorServices.save("getCodeNubeFact - Linea: 75", e);
      return { type: "ERROR" };
    }

    if (result && !result.numero) return { type: "SUCCESS", code: newCode };
    else newCode = newCode + 1;
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

exports.generateOrdenado = generateOrdenado;
exports.generatePagado = generatePagado;
exports.generateFacturado = generateFacturado;
exports.validateNubeFact = validateNubeFact;
exports.getCodeNubeFact = getCodeNubeFact;
exports.prepareFactura = prepareFactura;
