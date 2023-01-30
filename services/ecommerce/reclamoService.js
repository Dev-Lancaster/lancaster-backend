const mail = require("../../middleware/mail");
const general = require("../common/general");
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

async function sendEmail(reclamo) {
  const textHeader = "Se ha generado un reclamo con la siguiente informacion:";
  const html = general.mailTemplate(textHeader);
  await mail.sendMail("wgbila@gmail.com", "Generacion de Reclamo", html);
}

exports.save = save;
exports.findByEmail = findByEmail;
exports.sendEmail = sendEmail;
