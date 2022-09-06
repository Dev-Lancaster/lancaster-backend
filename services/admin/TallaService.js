const { Talla } = require("../../models/talla");

async function findAll() {
  return await Talla.find().sort({ nombre: 1 }).lean();
}

async function findById(id) {
  return await Talla.findById(id).lean();
}

async function save(model) {
  model.fechaCrea = new Date();
  let talla = new Talla(model);
  await talla.save();
  return { type: "SUCCESS", model: talla };
}

async function update(id, model) {
  return await Talla.findByIdAndUpdate(id, model);
}

async function findActive() {
  return await Talla.find({ activo: true }).sort({ nombre: 1 }).lean();
}

exports.findAll = findAll;
exports.findById = findById;
exports.save = save;
exports.update = update;
exports.findActive = findActive;
