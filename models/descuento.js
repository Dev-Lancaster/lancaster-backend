const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  codigo: Number,
  estado: String,
  producto: { type: Schema.Types.ObjectId, ref: "productos" },
  categoriaPadre: { type: Schema.Types.ObjectId, ref: "categoria" },
  categoriaHija: { type: Schema.Types.ObjectId, ref: "categoria" },
  etiqueta: String,
  valorOriginal: Number,
  valorNuevo: Number,
  porcentaje: Number,
  usuarioCrea: String,
  fechaCrea: Date,
});

const Descuento = mongoose.model("descuento", schema);

exports.Descuento = Descuento;
