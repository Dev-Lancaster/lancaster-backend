const constants = require("../../middleware/constants");
const fs = require("fs");
const { Producto } = require("../../models/producto");
const { FotoProducto } = require("../../models/fotoProducto");

function validateFilename(filename) {}

async function saveFoto(producto, files, usuario) {
  for (const file of files) {
    let model = new FotoProducto();
    model.producto = producto;
    /*
  posicion: String,
  orden: Number,
*/
    model.usuarioCrea = usuario;
    model.img.data = fs.readFileSync(file.path);
    model.img.contentType = file.mimetype;
    model.fechaCrea = new Date();
    await model.save();
  }
}

async function deleteFoto(id) {
  await FotoProducto.findByIdAndDelete(id);
}

async function deleteFotos(idProducto) {
  await FotoProducto.deleteMany({ producto: idProducto });
}

async function findFotoById(id) {
  const model = await FotoProducto.findById(id).lean();
  return model;
}

async function findFotos(idProducto) {
  const result = await FotoProducto.find({ producto: idProducto })
    .sort({ orden: 1 })
    .lean();
  return result;
}

async function findByEstado(estado) {
  const result = await Producto.find({ estado: estado })
    .sort({ categoria: 1, nombre: 1 })
    .lean();
  return result;
}

async function findByCategoriaEstado(categoria, estado) {
  const result = await Producto.find({ estado: estado, categoria: categoria })
    .sort({ nombre: 1 })
    .lean();
  return result;
}

async function findById(id) {
  const model = await Producto.findById(id);
  return model;
}

function validateProducto(model) {
  if (!model)
    return { type: constants.EMPTY, message: "El producto esta vacio" };
  if (!model.categoria)
    return {
      type: constants.ATR_MISSED,
      message: "La categoria no puede estar vacia",
    };
  if (!model.codigo)
    return {
      type: constants.ATR_MISSED,
      message: "El codigo del producto no puede estar vacio",
    };
  if (!model.nombre)
    return {
      type: constants.ATR_MISSED,
      message: "El nombre del producto no puede estar vacio",
    };
  if (!model.talla)
    return {
      type: constants.ATR_MISSED,
      message: "La talla del producto no puede estar vacio",
    };
  if (!model.color)
    return {
      type: constants.ATR_MISSED,
      message: "El color del producto no puede estar vacio",
    };
  if (!model.calidad)
    return {
      type: constants.ATR_MISSED,
      message: "La calidad del producto no puede estar vacio",
    };
  if (!model.especificaciones)
    return {
      type: constants.ATR_MISSED,
      message: "Las especificaciones del producto no puede estar vacio",
    };
  if (!model.usuarioCrea)
    return {
      type: constants.ATR_MISSED,
      message: "El usuario que crea el producto no puede estar vacio",
    };
  return { type: constants.SUCCESS };
}

async function save(model) {
  const validate = validateProducto(model);
  if (validate.type !== constants.SUCCESS) return validate;

  let body = new Producto(model);
  body.fechaCrea = new Date();

  await body.save();
  return body;
}

async function update(id, model) {
  const validate = validateProducto(model);
  if (validate.type !== constants.SUCCESS) return validate;

  model.fechaAct = new Date();
  const result = await Producto.findByIdAndUpdate(id, model);
  return result;
}

async function changeEstado(id, estado) {
  const model = await Producto.findByIdAndUpdate(id, { estado: estado });
  return model;
}

exports.findByCategoriaEstado = findByCategoriaEstado;
exports.findByEstado = findByEstado;
exports.findById = findById;
exports.save = save;
exports.update = update;
exports.changeEstado = changeEstado;
exports.findFotos = findFotos;
exports.findFotoById = findFotoById;
exports.deleteFotos = deleteFotos;
exports.deleteFoto = deleteFoto;
exports.saveFoto = saveFoto;
