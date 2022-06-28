const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  nombre: String,
  codigo: String,
  activo: Boolean,
  nivel: Number,
  usuarioCrea: String,
  fechaCrea: Date,
});

const Categoria = mongoose.model("categoria", schema);

exports.Categoria = Categoria;
