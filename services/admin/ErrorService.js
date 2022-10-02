const { Error } = require("../../models/error");

async function findAll() {
  return await Error.find().sort({ fechaCrea: -1 }).lean();
}

async function save(model) {
  model.fechaCrea = new Date();
  let error = new Error(model);
  await error.save();
}

exports.findAll = findAll;
exports.save = save;
