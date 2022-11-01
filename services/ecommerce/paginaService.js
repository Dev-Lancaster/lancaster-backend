const s3 = require("../../middleware/s3");
const fs = require("fs");
const { Pagina } = require("../../models/pagina");

async function removeFoto(idPagina, foto) {
  await Pagina.findByIdAndUpdate(idPagina, {
    $pull: { fotos: foto },
  });
  return await Pagina.findById(idPagina);
}

async function updateFotos(idPagina, files) {
  let pagina = await Pagina.findById(idPagina);
  if (!pagina)
    return {
      type: "ERROR",
      msg: "No se encontró el registro que desea actualizar",
    };

  let fotos = pagina.fotos;
  if (!fotos || fotos.length === 0) fotos = [];

  for (const file of files) {
    await s3.uploadFile(file);
    fotos.push(file.originalname);
    fs.unlinkSync(file.path);
  }
  await Pagina.findByIdAndUpdate(idPagina, {
    fotos: fotos,
  });
  pagina.fotos = fotos;
  return { type: "SUCCESS", model: pagina };
}

async function findById(id) {
  let result = await Pagina.findById(id).lean();
  if (result.fotos) {
    fotos = await getFotos(result.fotos);
    result.fotos = fotos;
  }
  return result;
}

async function remove(id) {
  await Pagina.findByIdAndDelete(id);
}

async function save(body) {
  if (body.fotos) {
    const fotos = await saveFotos(body.fotos);
    body.fotos = fotos;
  } else body.fotos = null;

  body.fechaCrea = new Date();
  let model = new Pagina(body);
  model = await model.save();
  return model;
}

async function findAll() {
  const result = await Pagina.find().lean();
  let data = [],
    fotos = [];

  for (const model of result) {
    if (model.fotos) fotos = await getFotos(model.fotos);
    data.push({
      tema: model.tema,
      titulo: model.titulo,
      subtitulo: model.subtitulo,
      descripcion: model.descripcion,
      fotos: fotos,
      usuarioCrea: model.usuarioCrea,
      fechaCrea: model.fechaCrea,
      _id: model._id,
    });
  }

  return data;
}

async function getFotos(fotos) {
  let newFotos = [];
  let url;
  for (const model of fotos) {
    url = await s3.getFileURL(model);
    newFotos.push(url);
  }
  return newFotos;
}

async function update(id, body) {
  await Pagina.findByIdAndUpdate(id, body);
  return await Pagina.findById(id).lean();
}

async function saveFotos(fotos) {
  let newFotos = [];
  let url;

  for (const foto of fotos) {
    await s3.uploadFile(foto);
    url = await s3.getFileURL(foto.originalname);
    newFotos.push(foto.originalname);
    fs.unlinkSync(foto.path);
  }

  return newFotos;
}

exports.save = save;
exports.findAll = findAll;
exports.update = update;
exports.remove = remove;
exports.findById = findById;
exports.updateFotos = updateFotos;
exports.removeFoto = removeFoto;
