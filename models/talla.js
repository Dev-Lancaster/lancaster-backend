const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  nombre: String,
  codigo: String,
  activo: Boolean,
  usuarioCrea: String,
  fechaCrea: Date,
});

const Talla = mongoose.model("talla", schema);

exports.Talla = Talla;
