const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  nombre: String,
  activo: Boolean,
  usuarioCrea: String,
  fechaCrea: Date,
});

const Categoria = mongoose.model("categoria", schema);

exports.Categoria = Categoria;
