const constants = require("../../middleware/constants");
const ExcelHelper = require("../common/excelHelper");
const CategoriaService = require("./categoriaService");
const fs = require("fs");
const _ = require("lodash");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { Producto } = require("../../models/producto");

const posiciones = ["FRO", "TRA", "IZQ", "DER", "ARR", "ABA"];

async function setOcupado(id) {
  await Producto.findByIdAndUpdate(id, {
    estado: "OCUPADO",
    fechaOcupado: new Date(),
  });
}

async function deleteFoto(id, idFoto) {
  await Producto.findByIdAndUpdate(id, {
    $pull: { fotos: { _id: idFoto } },
  });
}

async function prepareLoad(files, usuario) {
  let resultExcel;
  let resultImage;
  let resultImageArray = [];

  for (const f of files) {
    if (validateExcelFile(f.originalname.toLowerCase())) {
      resultExcel = await loadFile(f.path, usuario);
      fs.unlinkSync(f.path);
    }
  }
  for (const f of files)
    if (validateImageFile(f.originalname.toLowerCase())) {
      resultImage = await loadImages(f);
      fs.unlinkSync(f.path);
      resultImageArray.push(resultImage);
    }
  return { resultExcel: resultExcel, resultImageArray: resultImageArray };
}

async function findProductoLoad(codigo, talla, color) {
  const model = await Producto.findOne({
    codigo: codigo,
    talla: talla,
    color: color,
  });
  return model;
}

async function loadImages(file) {
  const validateImage = await validateFilename(file.originalname);
  if (validateImage.type === "ERROR") return validateImage;
  const values = validateImage.array;
  let producto = await findProductoLoad(
    values[0],
    values[3],
    values[4].split(".")[0]
  );
  if (producto) {
    let fotos = producto.fotos;
    let img = { data: fs.readFileSync(file.path), contentType: file.mimetype };
    fotos.push({
      orden: parseInt(values[1]),
      posicion: values[2],
      img: img,
    });
    await Producto.findByIdAndUpdate(producto._id, {
      fotos: fotos,
      estado: "ACTIVO",
    });
    return { type: "SUCCESS", filename: file.originalname };
  } else
    return {
      type: "ERROR",
      filename: file.originalname,
      msg: "No se encontró el producto de esta imagen",
    };
}

function validateExcelFile(f) {
  return f.includes("xls") || f.includes("xlsx");
}

function validateImageFile(f) {
  return (
    f.includes("bmp") ||
    f.includes("png") ||
    f.includes("jpg") ||
    f.includes("jpeg") ||
    f.includes("jfif") ||
    f.includes("pjpeg") ||
    f.includes("pjp") ||
    f.includes("svg") ||
    f.includes("webp")
  );
}

async function loadFile(filename, usuario) {
  let wb = await ExcelHelper.readExcel(filename);
  if (!wb)
    return {
      type: "ERROR_MSG",
      msg: "No se encontró el archivo que desea cargar",
    };
  let ws = verifyData(wb);
  if (ws) {
    try {
      const result = await run(ws, usuario);
      if (result.error.length === 0)
        return {
          type: "SUCCESS",
          countSuccess: result.countSuccess,
          data: result,
        };
      else
        return {
          type: "WITH ERROR",
          data: result,
          countSuccess: result.countSuccess,
        };
    } catch (e) {
      console.error(e);
      return {
        type: "ERROR_MSG",
        msg: "Ha ocurrido un error interno: " + e,
      };
    }
  } else
    return {
      type: "ERROR_MSG",
      msg: "El archivo esta vacio",
      countSuccess: result.countSuccess,
    };
}

async function run(ws, usuario) {
  let flag = true;
  let row = 2;
  let error = [];
  let categoriaModel;
  let cateHijaModel;
  let index = 1;
  let producto;
  let countSuccess = 0;
  let flagError = false;
  let body;
  let productoUpdates = [];

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
    const cantidad = ws.getCell(`J${row}`).value;
    const precio = ws.getCell(`K${row}`).value;

    if (!categoria) flag = false;
    else {
      categoriaModel = await CategoriaService.findByCodigo(categoria);
      if (!categoriaModel) {
        error.push({
          message: `La categoría padre esta incorrecta (Fila ${index})`,
        });
        flagError = true;
      } else if (categoriaModel.nivel !== 0) {
        flagError = true;
        error.push({
          message: `La categoría padre no es una categoría padre (Fila ${index})`,
        });
      }

      cateHijaModel = await CategoriaService.findByCodigo(categoriaHija);
      if (!cateHijaModel) {
        error.push({
          message: `La categoría hija esta incorrecta (Fila ${index})`,
        });
        flagError = true;
      } else if (cateHijaModel.nivel !== 1) {
        flagError = true;
        error.push({
          message: `La categoría hija no es una categoría hija (Fila ${index})`,
        });
      }
      if (isNaN(calidad)) {
        flagError = true;
        error.push({
          message: `El campo calidad debe ser un numero (Fila ${index})`,
        });
      }
      if (parseInt(calidad) < 0 || parseInt(calidad) > 5) {
        flagError = true;
        error.push({
          message: `El campo calidad debe ser un numero entre 1 a 5 (Fila ${index})`,
        });
      }
      if (isNaN(cantidad)) {
        flagError = true;
        error.push({
          message: `El campo cantidad debe ser un numero (Fila ${index})`,
        });
      }
      if (isNaN(precio)) {
        flagError = true;
        error.push({
          message: `El campo precio debe ser un numero (Fila ${index})`,
        });
      }
      producto = await findProductoLoad(codigo, talla, color);

      if (!flagError && producto) productoUpdates.push(producto);

      if (!flagError && !producto) {
        body = {
          categoria: categoriaModel._id,
          categoriaHija: cateHijaModel._id,
          categoriaNombre: categoriaModel.nombre,
          categoriaHijaNombre: cateHijaModel.nombre,
          categoriaFull: categoriaModel._id + "-" + categoriaModel.nombre,
          categoriaHijaFull: cateHijaModel._id + "-" + cateHijaModel.nombre,
          codigo: codigo,
          nombre: nombre,
          talla: talla,
          color: color,
          calidad: calidad,
          especificaciones: especificaciones,
          etiqueta: prepareEtiqueta(etiqueta),
          cantidad: cantidad,
          monto: precio,
          estado: "SIN FOTOS",
          usuarioCrea: usuario,
          fechaCrea: new Date(),
        };
        await saveProducto(body);
        countSuccess = countSuccess + 1;
      }

      index = index + 1;
      row = row + 1;
      flagError = false;
    }
  }
  return {
    error: error,
    countSuccess: countSuccess,
    productoUpdates: productoUpdates,
  };
}

function prepareEtiqueta(etiqueta) {
  if (!etiqueta) return null;
  let result = etiqueta.split(",");
  let resultReturn = [];
  for (const r of result) if (r) resultReturn.push(r);
  return resultReturn;
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
  if (!filename)
    return { type: "ERROR", msg: "El archivo viene vacio", filename: filename };
  if (typeof filename !== "string")
    return {
      type: "ERROR",
      msg: "El formato del nombre del archivo es incorrecto",
      filename: filename,
    };
  if (!filename.includes("_"))
    return {
      type: "ERROR",
      msg: "El formato del archivo es incorrecto",
      filename: filename,
    };
  if (filename.split("_").length !== 5)
    return {
      type: "ERROR",
      msg: "El formato del archivo es incorrecto",
      filename: filename,
    };

  const array = filename.split("_");
  const producto = await findProductoByCodigo(array[0]);
  if (!producto)
    return {
      type: "ERROR",
      msg: "El codigo del producto es invalido",
      filename: filename,
    };

  if (_.isNaN(array[1]))
    return {
      type: "ERROR",
      msg: "El valor relacionado al orden de la imagen debe ser un numero",
      filename: filename,
    };
  if (!posiciones.includes(array[2]))
    return {
      type: "ERROR",
      msg: "El valor de posicion de la imagen es incorrecto",
      filename: filename,
    };

  return { type: "SUCCESS", array: array, filename: filename };
}

async function findProductoByCodigo(codigo) {
  return await Producto.findOne({ codigo: codigo }).lean();
}

/*********** ECOMMERCE ***********/
async function findEById(id) {
  const result = await Producto.aggregate([
    {
      $match: {
        _id: ObjectId(id),
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

async function findAllEcom() {
  const results = await Producto.aggregate([
    {
      $match: {
        estado: "ACTIVO",
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
        _id: d._id,
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

async function onlyUpdateInfo(id, model) {
  const producto = await Producto.findByIdAndUpdate(id, model);
  return producto;
}

async function updateInfo(id, model) {
  const validate = validateProducto(model);
  if (validate.type !== constants.SUCCESS) return validate;
  model.fechaAct = new Date();
  try {
    console.log(model.color);
    //await Producto.findByIdAndUpdate(id, model);
    return { type: "SUCCESS" };
  } catch (e) {
    console.error(e);
    return {
      type: "ERROR",
      msg: "Ha ocurrido un error al actualizar el producto",
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
  let list = [];
  let categoriaPadre, categoriaHija;
  for (const model of result) {
    categoriaPadre = await CategoriaService.findById(model.categoria);
    categoriaHija = await CategoriaService.findById(model.categoriaHija);
    list.push({
      ...model,
      categoriaPadreCodigo: categoriaPadre.codigo,
      categoriaHijaCodigo: categoriaHija.codigo,
    });
  }
  return list;
}

exports.findAll = findAll;
exports.findAllEcom = findAllEcom;
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
exports.updateInfo = updateInfo;
exports.findEById = findEById;
exports.prepareLoad = prepareLoad;
exports.onlyUpdateInfo = onlyUpdateInfo;
exports.setOcupado = setOcupado;
