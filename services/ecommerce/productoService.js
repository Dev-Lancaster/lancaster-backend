const constants = require("../../middleware/constants");
const ExcelHelper = require("../common/excelHelper");
const fs = require("fs");
const CategoriaService = require("./categoriaService");
const { Producto } = require("../../models/producto");
const { FotoProducto } = require("../../models/fotoProducto");
const _ = require("lodash");

const posiciones = ["FRO", "TRA", "IZQ", "DER", "ARR", "ABA"];

async function loadFile(filename) {
  let wb = await ExcelHelper.readExcel(filename);
  if (!wb)
    return {
      type: "ERROR_LABEL",
      msg: "No se encontró el archivo que desea cargar",
    };
  let ws = verifyData(wb);
  if (ws) {
    const result = await run(ws);
    if (result.length === 0) return { type: "SUCCESS" };
    else return { type: "WITH ERROR", data: result };
  } else return { type: "ERROR", msg: "El archivo esta vacio" };
}

async function run(ws) {
  let flag = true;
  let row = 2;
  let error = [];
  let categoriaModel;
  let productoModel;
  let index = 1;
  let flagError = false;
  let body;

  while (flag) {
    const categoria = ws.getCell(`A${row}`).value;
    const categoriaHija = ws.getCell(`B${row}`).value;
    const codigo = ws.getCell(`C${row}`).value;
    const nombre = ws.getCell(`D${row}`).value;
    const talla = ws.getCell(`E${row}`).value;
    const color = ws.getCell(`F${row}`).value;
    const calidad = ws.getCell(`G${row}`).value;
    const especificaciones = ws.getCell(`H${row}`).value;
    const etiqueta = ws.getCell(`I${row}`).value;

    if (!categoria) flag = false;
    else {
      categoriaModel = await CategoriaService.findById(categoria);
      if (!categoriaModel) {
        error.push({
          message: `La categoria padre esta incorrecta (Fila ${index})`,
        });
        flagError = true;
      } else if (categoriaModel.nivel !== 0) {
        flagError = true;
        error.push({
          message: `La categoria padre no es una categoria padre (Fila ${index})`,
        });
      }

      categoriaModel = await CategoriaService.findById(categoriaHija);
      if (!categoriaModel) {
        error.push({
          message: `La categoria hija esta incorrecta (Fila ${index})`,
        });
        flagError = true;
      } else if (categoriaModel.nivel !== 0) {
        flagError = true;
        error.push({
          message: `La categoria hija no es una categoria hija (Fila ${index})`,
        });
      }

      productoModel = await Producto.findOne({ codigo: codigo }).lean();
      if (productoModel) {
        flagError = true;
        error.push({
          message: `El codigo del producto ya existe (Fila ${index})`,
        });
      }

      if (flagError) {
        body = {
          categoria: categoria,
          categoriaHija: categoriaHija,
          codigo: codigo,
          nombre: nombre,
          talla: talla,
          color: color,
          calidad: calidad,
          especificaciones: especificaciones,
        };
        await saveProducto(body);
      }

      index = index + 1;
      flagError = true;
    }
  }
}

async function saveProducto(model) {
  let body = new Producto(model);
  await body.save();
}

function verifyData(wb) {
  let ws = wb.worksheets[0];
  const label = ws.getCell("B1").value;
  const hour = ws.getCell("A2").value;

  if (label && hour) return ws;
  return null;
}

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
  for (const file of files) {
    let model = new FotoProducto();
    model.producto = producto;
    model.usuarioCrea = usuario;
    model.img.data = fs.readFileSync(file.path);
    model.img.contentType = file.mimetype;
    model.fechaCrea = new Date();
    await model.save();
    fs.unlinkSync(file.path);
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

/*********** ECOMMERCE ***********/
async function findECategoriaHija(categoria) {
  const model = await Producto.find({
    categoriaHija: categoria,
    estado: "ACTIVA",
  })
    .populate("categoria")
    .lean();
  return convertList(model);
}

async function findECategorias(categoriaPadre, categoriaHija) {
  const model = await Producto.findOne({
    categoria: categoriaPadre,
    categoriaHija: categoriaHija,
    estado: "ACTIVA",
  }).lean();
  return convertModel(model);
}

async function findEByEtiqueta(etiqueta) {
  const result = await Producto.find({ estado: "ACTIVA", etiqueta: etiqueta })
    .populate("categoria")
    .populate("categoriaHija")
    .sort({ categoria: 1, nombre: 1 })
    .lean();
  return convertList(result);
}

async function findEByCategoriaPadre(categoria) {
  const result = await Producto.find({ estado: "ACTIVA", categoria: categoria })
    .populate("categoriaHija")
    .sort({ nombre: 1 })
    .lean();
  return convertList(result);
}

async function convertModel(model) {
  if (!model) return;
  let clone = { ...model };
  const fotos = await FotoProducto.find({ producto: clone._id })
    .sort({ orden: 1 })
    .lean();
  clone.fotos = fotos;
  return clone;
}

async function convertList(list) {
  let lst = [];
  for (const model of list) lst.push(await convertModel(model));
  return lst;
}
/*********** FIN ECOMMERCE ***********/

async function findDistinctCode() {
  const result = await Producto.find({ estado: "ACTIVA" })
    .sort({ codigo: 1 })
    .distinct("codigo")
    .lean();
  return result;
}

async function findProductoCategoriaHija(categoria, estado) {
  return await Producto.findOne({
    categoriaHija: categoria,
    estado: estado,
  }).lean();
}

async function findProductoCategorias(categoriaPadre, categoriaHija, estado) {
  return await Producto.findOne({
    categoria: categoriaPadre,
    categoriaHija: categoriaHija,
    estado: estado,
  }).lean();
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
      message: "La categoria padre no puede estar vacia",
    };
  if (!model.categoriaHija)
    return {
      type: constants.ATR_MISSED,
      message: "La categoria hija no puede estar vacia",
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

async function save(model, files) {
  model.etiqueta = model.etiqueta.split(",");
  const validate = validateProducto(model);
  if (validate.type !== constants.SUCCESS) return validate;

  let body = new Producto(model);
  body.fechaCrea = new Date();

  try {
    await body.save();
    await saveFoto(body._id, files, body.usuarioCrea);
    return { type: "SUCCESS" };
  } catch (e) {
    console.error(e);
    return {
      type: "ERROR",
      msg: "Ha ocurrido un error al guardar el producto",
    };
  }
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

async function findAll() {
  const result = await Producto.find()
    .populate("categoria")
    .populate("categoriaHija")
    .sort({ nombre: 1 })
    .lean();
  return convertList(result);
}

exports.findAll = findAll;
exports.findEByCategoriaPadre = findEByCategoriaPadre;
exports.findEByEtiqueta = findEByEtiqueta;
exports.findECategorias = findECategorias;
exports.findECategoriaHija = findECategoriaHija;
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
exports.findProductoCategorias = findProductoCategorias;
exports.findProductoCategoriaHija = findProductoCategoriaHija;
exports.findDistinctCode = findDistinctCode;
