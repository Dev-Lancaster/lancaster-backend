const { Reclamo } = require("../../models/reclamo");

async function save(model) {
  model.fechaCrea = new Date();
  let body = new Reclamo(model);
  await body.save();
}

async function findByEmail(email) {
  const result = await Reclamo.find({ email: email })
    .sort({ fechaCrea: -1 })
    .lean();
  return result;
}

exports.save = save;
exports.findByEmail = findByEmail;
