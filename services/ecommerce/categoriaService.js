const { Categoria } = require("../../models/categoria");

async function findAll() {
  return await Categoria.find().sort({ nombre: 1 }).lean();
}

async function findActive() {
  return await Categoria.find({ activo: true }).sort({ nombre: 1 }).lean();
}

async function findById(id) {
  return await Categoria.findById(id).lean();
}

async function save(model) {
  if (!model)
    return { type: "EMPTY", message: "Los datos de la categoría estan vacios" };
  if (!model.nombre)
    return { type: "EMPTY", message: "El nombre de la categoría esta vacio" };
  if (!model.usuarioCrea)
    return {
      type: "EMPTY",
      message: "El nombre del usuario que crea la categoría esta vacio",
    };
  model.fechaCrea = new Date();
  let categoria = new Categoria(model);
  await categoria.save();
  return { type: "SUCCESS", model: categoria };
}

async function inactivate(id) {
  const model = await Categoria.findByIdAndUpdate(id, { activo: false });
  return model;
}

async function activate(id) {
  const model = await Categoria.findByIdAndUpdate(id, { activo: true });
  return model;
}

async function update(id, model) {
  return await Categoria.findByIdAndUpdate(id, model);
}

exports.findAll = findAll;
exports.findActive = findActive;
exports.findById = findById;
exports.save = save;
exports.inactivate = inactivate;
exports.update = update;
exports.activate = activate;
