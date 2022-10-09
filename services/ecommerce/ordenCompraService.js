const fetch = require("node-fetch");
const ErrorServices = require("../admin/ErrorService");
const { OrdenCompra } = require("../../models/ordenCompra");
const { Producto } = require("../../models/producto");

async function generateOrdenado(model) {
  const codigo = await generateCodigo();
  const resultNubeFact = await validateNubeFact(codigo);

  if (resultNubeFact.type === "ERROR")
    return {
      type: "ERROR",
      msg: "Ha ocurrido un error al generar el codigo de facturacion",
    };

  model.codigoNubeFact = resultNubeFact.code;
  model.estado = "ORDENADO";
  model.id = codigo;
  model.codigo = "LNC-" + codigo;
  model.fechaCrea = new Date();

  let orden = new OrdenCompra(model);
  orden = await orden.save();
  return { type: "SUCCESS", orden: orden };
}

function getTotal(productos) {
  let total = 0.0;
  for (const producto of productos)
    if (producto.precio && producto.cantidad)
      total = producto.precio * producto.cantidad + total;
  return total;
}

async function generatePagado(id, model) {
  if (model.culqui) {
    model.estado = "PAGADO";
    const result = await OrdenCompra.findByIdAndUpdate(id, model);
    await changeInventario(model.detalle);
    return result;
  } else return null;
}

async function generateFacturado(id, model) {
  if (model.codigoFact) {
    model.estado = "FACTURADO";
    const result = await OrdenCompra.findByIdAndUpdate(id, model);
    return result;
  }
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
  if (!model) return 1;
  return model.id + 1;
}

async function getCodeNubeFact(code) {
  if (!code) return { type: "ERROR" };
  if (isNaN(code)) return { type: "ERROR" };

  let newCode = code;
  let validFlag = true;
  let result;

  while (validFlag) {
    try {
      result = await validateNubeFact(newCode);
    } catch (e) {
      await ErrorServices.save("getCodeNubeFact - Linea: 75", e);
      return { type: "ERROR" };
    }

    if (result && result.numero && result.aceptada_por_sunat)
      return { type: "SUCCESS", code: newCode };
    else newCode = newCode + 1;
  }
  return { type: "ERROR" };
}

async function validateNubeFact(code) {
  const body = {
    operacion: "consultar_comprobante",
    tipo_de_comprobante: "1",
    serie: "FTV1",
    numero: code,
  };
  const api =
    "https://api.nubefact.com/api/v1/08732aed-16ff-435a-89e5-a73c450ae468";

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
