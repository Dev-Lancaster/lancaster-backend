const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  categoria: { type: Schema.Types.ObjectId, ref: "categoria" },
  categoriaHija: { type: Schema.Types.ObjectId, ref: "categoria" },
  codigo: String,
  nombre: String,
  talla: String,
  color: String,
  calidad: String,
  monto: Number,
  especificaciones: String,
  estado: String,
  etiqueta: [String],
  usuarioCrea: String,
  fechaCrea: Date,
  usuarioAct: String,
  fechaAct: Date,
});

const Producto = mongoose.model("producto", schema);

exports.Producto = Producto;
