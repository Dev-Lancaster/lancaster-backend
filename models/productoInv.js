const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  producto: { type: Schema.Types.ObjectId, ref: "producto" },
  ocupado: boolean,
  fechaOcupado: Date,
});

const ProductoInv = mongoose.model("productoInv", schema);

exports.ProductoInv = ProductoInv;
