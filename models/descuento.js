const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  codigo: Number,
  estado: String,
  producto: { type: Schema.Types.ObjectId, ref: "producto" },
  categoriaPadre: String,
  categoriaHija: String,
  etiqueta: String,
  porcentaje: Number,
  usuarioCrea: String,
  fechaCrea: Date,
});

const Descuento = mongoose.model("descuento", schema);

exports.Descuento = Descuento;
