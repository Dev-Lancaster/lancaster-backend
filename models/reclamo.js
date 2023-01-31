const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  tipoIdentificacion: String,
  apellidoPaterno: String,
  apellidoMaterno: String,
  identificacion: String,
  departamento: String,
  menor: String,
  apoderado: String,
  razonSocial: String,
  firstname: String,
  phone: String,
  address: String,
  country: String,
  email: String,
  ruc: String,
  tipoReclamo: String,
  monto: Number,
  descripcion: String,
  disconformidad: String,
  detalle: String,
  pedido: String,
  naturaleza: String,
  fechaCrea: Date,
  id: Number,
  year: Number,
});

const Reclamo = mongoose.model("reclamo", schema);

exports.Reclamo = Reclamo;
