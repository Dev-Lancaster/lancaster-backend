const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  departamento: String,
  provincia: String,
  distrito: String,
  tarifa: Number,
  plazo: String,
});

const Tarifas = mongoose.model("tarifas", schema, "tarifas");

exports.Tarifas = Tarifas;
