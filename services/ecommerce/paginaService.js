const s3 = require("../../middleware/s3");
const fs = require("fs");
const { Pagina } = require("../../models/pagina");

async function remove(id) {
  await Pagina.findByIdAndDelete(id);
}

async function save(body) {
  if (body.fotos) {
    const fotos = await saveFotos(body.fotos);
    body.fotos = fotos;
  } else body.fotos = null;

  const exist = await Pagina.findOne({ tema: body.tema });
  if (exist) return await update(exist._id, body);

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
    fotos = await getFotos(model.fotos);
    data.push({
      tema: model.tema,
      descripcion: model.descripcion,
      fotos: fotos,
      usuarioCrea: model.usuarioCrea,
      fechaCrea: model.fechaCrea,
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
