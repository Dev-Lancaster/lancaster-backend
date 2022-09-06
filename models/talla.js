const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  nombre: String,
  activo: Boolean,
  usuarioCrea: String,
  fechaCrea: Date,
});

const Talla = mongoose.model("talla", schema);

exports.Talla = Talla;
