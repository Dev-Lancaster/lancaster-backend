const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  categoria: { type: Schema.Types.ObjectId, ref: "categoria" },
  codigo: String,
  talla: String,
  color: String,
  calidad: String,
  especificaciones: String,
  estado: String,
  usuarioCrea: String,
  fechaCrea: Date,
  usuarioAct: String,
  fechaAct: Date,
});

const Producto = mongoose.model("producto", schema);

exports.Producto = Producto;
