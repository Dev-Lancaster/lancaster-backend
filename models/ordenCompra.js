const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productoSchema = new Schema({
  producto: { type: Schema.Types.ObjectId, ref: "producto" },
  cantidad: Number,
});

const schema = new mongoose.Schema({
  codigo: String,
  culqui: String,
  codigoFact: String,
  detalle: [productoSchema],
  fechaCrea: Date,
});

const OrdenCompra = mongoose.model("ordenCompra", schema);

exports.OrdenCompra = OrdenCompra;