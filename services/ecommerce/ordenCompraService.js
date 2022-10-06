const { OrdenCompra } = require("../../models/ordenCompra");
const { Producto } = require("../../models/producto");

async function generateOrdenado(model) {
  const codigo = await generateCodigo();

  model.estado = "ORDENADO";
  model.id = codigo;
  model.codigo = "LNC-" + codigo;
  model.fechaCrea = new Date();

  let orden = new OrdenCompra(model);
  orden = await orden.save();
  return orden;
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

exports.generateOrdenado = generateOrdenado;
exports.generatePagado = generatePagado;
exports.generateFacturado = generateFacturado;
