const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fotoSchema = new Schema({
  orden: Number,
  posicion: String,
  img: { data: Buffer, contentType: String },
});

const schema = new Schema({
  categoria: { type: Schema.Types.ObjectId, ref: "categoria" },
  categoriaHija: { type: Schema.Types.ObjectId, ref: "categoria" },
  categoriaNombre: String,
  categoriaHijaNombre: String,
  categoriaFull: String,
  categoriaHijaFull: String,
  codigo: String,
  nombre: String,
  talla: String,
  color: String,
  colorNombre: String,
  calidad: Number,
  monto: Number,
  especificaciones: String,
  estado: String,
  cantidad: Number,
  fotos: [fotoSchema],
  etiqueta: [String],
  usuarioCrea: String,
  fechaCrea: Date,
  usuarioAct: String,
  fechaAct: Date,
  fechaOcupado: Date,
});

const Producto = mongoose.model("productos_temp", schema);

exports.Producto = Producto;
