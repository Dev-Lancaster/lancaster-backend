const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  tema: String,
  descripcion: String,
  fotos: [String],
  usuarioCrea: String,
  fechaCrea: Date,
});

const Pagina = mongoose.model("pagina", schema);

exports.Pagina = Pagina;
