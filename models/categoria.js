const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
  nombre: String,
  codigo: String,
  activo: Boolean,
  nivel: Number,
  padre: { type: Schema.Types.ObjectId, ref: "categoria" },
  usuarioCrea: String,
  fechaCrea: Date,
});

const Categoria = mongoose.model("categoria", schema);

exports.Categoria = Categoria;
