const { Error } = require("../../models/error");

async function findAll() {
  return await Error.find().sort({ fechaCrea: -1 }).lean();
}

async function save(titulo, descripcion) {
  let body = {
    titulo: titulo,
    descripcion: descripcion,
    fechaCrea: new Date(),
  };
  let error = new Error(body);
  await error.save();
}

exports.findAll = findAll;
exports.save = save;
