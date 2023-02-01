const mail = require("../../middleware/mail");
const moment = require("moment");
const general = require("../common/general");
const usuarioService = require("../admin/UsuarioService");
const { Reclamo } = require("../../models/reclamo");

async function save(model) {
  const date = new Date();
  model.fechaCrea = date;
  model.year = date.getFullYear();
  model.id = await generateId();
  model.estado = "PROCESADO";
  let body = new Reclamo(model);
  await body.save();
  return body;
}

async function findByEmail(email) {
  const result = await Reclamo.find({ email: email })
    .sort({ fechaCrea: -1 })
    .lean();
  return result;
}

async function generateId() {
  const year = new Date().getFullYear();
  const reclamo = await Reclamo.findOne({ year: year }).sort({ id: -1 });
  if (!reclamo) return 1;
  return reclamo.id + 1;
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
                  <td><strong>ID del reclamo:</strong></td>
                  <td>${reclamo.id}-${reclamo.year}</td>
                </tr>
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
                    moment(reclamo.fechaCrea).utc().format("DD/MM/YYYY")
                  }</td>
                </tr>
              </table>
            </div>
          </div>`;
    const html = await general.mailTemplate(textHeader);
    const user = await usuarioService.findRecibe();
    await mail.sendMailWithCC(
      reclamo.email,
      "Generación de Reclamo: " + reclamo.id + "-" + reclamo.year,
      html,
      [user.correo]
    );
  }
}

exports.save = save;
exports.findByEmail = findByEmail;
exports.sendEmail = sendEmail;
