const { Descuento } = require("../../models/descuento");
const { Producto } = require("../../models/producto");

async function maxCodigo() {
  const descuento = await Descuento.findOne().sort({ codigo: -1 }).lean();
  if (!descuento) return 1;
  return descuento.codigo + 1;
}

async function save(list) {
  const codigo = await maxCodigo();
  const fechaCrea = new Date();
  let model;

  for (let body of list) {
    body.codigo = codigo;
    body.fechaCrea = fechaCrea;
    model = new Descuento(body);
    await model.save();
    await Producto.findByIdAndUpdate(body.producto, {
      precioDescuento: body.valorNuevo,
      descuento: body.porcentaje,
      poseeDescuento: true,
    });
  }
}

async function findAll() {
  const list = await Descuento.find()
    .populate("producto")
    .populate("categoriaPadre")
    .populate("categoriaHija")
    .sort({ codigo: -1 })
    .lean();
  return list;
}

exports.maxCodigo = maxCodigo;
exports.save = save;
exports.findAll = findAll;
