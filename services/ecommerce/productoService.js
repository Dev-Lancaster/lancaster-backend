const constants = require("../../middleware/constants");
const ExcelHelper = require("../common/excelHelper");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const fs = require("fs");
const CategoriaService = require("./categoriaService");
const { Producto } = require("../../models/producto");
const _ = require("lodash");

const posiciones = ["FRO", "TRA", "IZQ", "DER", "ARR", "ABA"];

async function deleteFoto(id, idFoto) {
  await Producto.findByIdAndUpdate(id, {
    $pull: { fotos: { _id: idFoto } },
  });
}

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

async function findProductoByCodigo(codigo) {
  return await Producto.findOne({ codigo: codigo }).lean();
}

/*********** ECOMMERCE ***********/
async function findECategoriaHija(categoria) {
  const result = await Producto.aggregate([
    {
      $match: {
        estado: "ACTIVO",
        categoriaHija: ObjectId(categoria),
      },
    },
    { $sort: { nombre: 1 } },
    {
      $group: {
        _id: {
          codigo: "$codigo",
          nombre: "$nombre",
          categoria: "$categoriaNombre",
          categoriaHija: "$categoriaHijaNombre",
          calidad: "$calidad",
          monto: "$monto",
          especificaciones: "$especificaciones",
          etiqueta: "$etiqueta",
        },
        data: { $push: "$$ROOT" },
      },
    },
  ]);
  return await fill(result);
}

async function findECategorias(categoriaPadre, categoriaHija) {
  const results = await Producto.aggregate([
    {
      $match: {
        estado: "ACTIVO",
        categoria: ObjectId(categoriaPadre),
        categoriaHija: ObjectId(categoriaHija),
      },
    },
    { $sort: { nombre: 1 } },
    {
      $group: {
        _id: {
          codigo: "$codigo",
          nombre: "$nombre",
          categoria: "$categoriaNombre",
          categoriaHija: "$categoriaHijaNombre",
          calidad: "$calidad",
          monto: "$monto",
          especificaciones: "$especificaciones",
          etiqueta: "$etiqueta",
        },
        data: { $push: "$$ROOT" },
      },
    },
  ]);
  return await fill(results);
}

async function fill(results) {
  let lst = [];
  let dataList = [];
  let colors = [];
  let tallas = [];

  for (const model of results) {
    dataList = [];

    for (const d of model.data) {
      dataList.push({
        talla: d.talla,
        color: d.color,
        cantidad: d.cantidad,
        fotos: d.fotos,
      });
    }

    colorNombre = [...new Set(dataList.map((item) => item.colorNombre))];
    colors = [...new Set(dataList.map((item) => item.color))];
    tallas = [...new Set(dataList.map((item) => item.talla))];
    lst.push({
      ...model._id,
      colors: colors,
      tallas: tallas,
      data: dataList,
    });
  }
  return lst;
}

async function findEByEtiqueta(etiqueta) {
  const results = await Producto.aggregate([
    {
      $match: {
        estado: "ACTIVO",
        etiqueta: etiqueta,
      },
    },
    { $sort: { nombre: 1 } },
    {
      $group: {
        _id: {
          codigo: "$codigo",
          nombre: "$nombre",
          categoria: "$categoriaNombre",
          categoriaHija: "$categoriaHijaNombre",
          calidad: "$calidad",
          monto: "$monto",
          especificaciones: "$especificaciones",
          etiqueta: "$etiqueta",
        },
        data: { $push: "$$ROOT" },
      },
    },
  ]);

  return fill(results);
}

async function findEByCategoriaPadre(categoria) {
  const results = await Producto.aggregate([
    {
      $match: {
        estado: "ACTIVO",
        categoria: ObjectId(categoria),
      },
    },
    { $sort: { nombre: 1 } },
    {
      $group: {
        _id: {
          codigo: "$codigo",
          nombre: "$nombre",
          categoria: "$categoriaNombre",
          categoriaHija: "$categoriaHijaNombre",
          calidad: "$calidad",
          monto: "$monto",
          especificaciones: "$especificaciones",
          etiqueta: "$etiqueta",
        },
        data: { $push: "$$ROOT" },
      },
    },
  ]);

  return fill(results);
}
/*********** FIN ECOMMERCE ***********/

async function findDistinctCode() {
  const result = await Producto.find({ estado: "ACTIVO" })
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

  let fotos = [];
  let img = {};
  for (const file of files) {
    img = { data: fs.readFileSync(file.path), contentType: file.mimetype };
    array = file.originalname.split("_");
    fotos.push({
      orden: parseInt(array[1]),
      posicion: array[2].split(".")[0],
      img: img,
    });
    fs.unlinkSync(file.path);
  }
  body.fotos = fotos;

  try {
    await body.save();
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
  model.etiqueta = model.etiqueta.split(",");
  const validate = validateProducto(model);
  if (validate.type !== constants.SUCCESS) return validate;

  model.fechaAct = new Date();
  try {
    await Producto.findByIdAndUpdate(id, model);
    await saveFoto(id, files, model.usuarioAct);
    return { type: "SUCCESS" };
  } catch (e) {
    console.error(e);
    return {
      type: "ERROR",
      msg: "Ha ocurrido un error al actualizar el producto",
    };
  }
}

async function changeEstado(id, estado) {
  const model = await Producto.findByIdAndUpdate(id, { estado: estado });
  return model;
}

async function findAll() {
  const result = await Producto.find().sort({ nombre: 1 }).lean();
  return result;
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
exports.findByEtiquetaEstado = findByEtiquetaEstado;
exports.findProductoByCodigo = findProductoByCodigo;
exports.findProductoCategorias = findProductoCategorias;
exports.findProductoCategoriaHija = findProductoCategoriaHija;
exports.findDistinctCode = findDistinctCode;
exports.deleteFoto = deleteFoto;
