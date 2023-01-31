const mail = require("../../middleware/mail");
const moment = require("moment");
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
  if (reclamo) {
    const textHeader = `
          <div class="row" style='margin-top: 30px'>
            <div class="col s12">Se ha generado un nuevo reclamo con la siguiente informaci&oacute;n:</div>
          </div>
          <div class="row" style='margin-top: 25px'>
            <div class="col s12">
              <table>
                <tr>
                  <td><strong>Nombre:</strong></td>
                  <td>${reclamo.firstname} ${reclamo.apellidoPaterno}</td>
                </tr>
                <tr>
                  <td><strong>Tel&eacute;fono:</strong></td>
                  <td>${reclamo.phone}</td>
                </tr>
                <tr>
                  <td><strong>Tipo de Reclamo:</strong></td>
                  <td>${reclamo.tipoReclamo}</td>
                </tr>
                <tr>
                  <td><strong>Descripci&oacute;n:</strong></td>
                  <td>${reclamo.descripcion}</td>
                </tr>
                <tr>
                  <td><strong>Disconformidad:</strong></td>
                  <td>${reclamo.disconformidad}</td>
                </tr>
                <tr>
                  <td><strong>Fecha de creaci&oacute;n:</strong></td>
                  <td>${
                    reclamo.fechaCrea &&
                    moment(reclamo.fechaCrea).format("DD/MM/YYYY")
                  }</td>
                </tr>
              </table>
            </div>
          </div>`;
    const html = await general.mailTemplate(textHeader);
    await mail.sendMail("wgbila@gmail.com", "Generacion de Reclamo", html);
  }
}

exports.save = save;
exports.findByEmail = findByEmail;
exports.sendEmail = sendEmail;
