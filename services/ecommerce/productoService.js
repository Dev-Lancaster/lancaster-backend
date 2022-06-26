const constants = require("../../middleware/constants");
const fs = require("fs");
const { Producto } = require("../../models/producto");
const { FotoProducto } = require("../../models/fotoProducto");
const _ = require("lodash");

const posiciones = ["FRO", "TRA", "IZQ", "DER", "ARR", "ABA"];

async function validateFilename(filename) {
  if (!filename) return { type: "ERROR", msg: "El archivo viene vacio" };
  if (typeof filename !== "string")
    return {
      type: "ERROR",
      msg: "El formato del nombre del archivo es incorrecto",
    };
  if (!filename.includes("_"))
    return { type: "ERROR", msg: "El formato del archivo es incorrecto" };
  if (!filename.split("_").length !== 3)
    return { type: "ERROR", msg: "El formato del archivo es incorrecto" };

  const array = filename.split("_");
  const producto = await findProductoByCodigo(array[0]);
  if (!producto)
    return { type: "ERROR", msg: "El codigo del producto es invalido" };

  if (_.isNaN(array[1]))
    return {
      type: "ERROR",
      msg: "El valor relacionado al orden de la imagen debe ser un numero",
    };

  if (!posiciones.includes(array[2]))
    return {
      type: "ERROR",
      msg: "El valor de posicion de la imagen es incorrecto",
    };

  return { type: "SUCCESS", array: array };
}

async function saveFoto(producto, files, usuario) {
  let errors = [];
  let resultValidate;
  for (const file of files) {
    resultValidate = await validateFilename(file.name);
    if (resultValidate.type === "SUCCESS") {
      let model = new FotoProducto();
      model.producto = producto;
      model.posicion = resultValidate.array[2];
      model.orden = resultValidate.array[1];
      model.usuarioCrea = usuario;
      model.img.data = fs.readFileSync(file.path);
      model.img.contentType = file.mimetype;
      model.fechaCrea = new Date();
      await model.save();
      fs.unlinkSync(file.path);
    } else errors.push(resultValidate);
  }
  return errors;
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

async function findProductoByCodigo(codigo) {
  return await Producto.findOne({ codigo: codigo }).lean();
}

async function findByEtiquetaEstado(etiqueta, estado) {
  const result = await Producto.find({ estado: estado, etiqueta: etiqueta })
    .sort({ categoria: 1, nombre: 1 })
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
  if (!model.etiqueta)
    return {
      type: constants.ATR_MISSED,
      message: "Debe definir al menos una etiqueta para el producto",
    };
  if (model.etiqueta.length === 0)
    return {
      type: constants.ATR_MISSED,
      message: "Debe definir al menos una etiqueta para el producto",
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
exports.findByEtiquetaEstado = findByEtiquetaEstado;
exports.findProductoByCodigo = findProductoByCodigo;
