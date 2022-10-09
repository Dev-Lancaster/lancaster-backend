const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productoSchema = new Schema({
  producto: { type: Schema.Types.ObjectId, ref: "producto" },
  precio: Number,
  cantidad: Number,
});

const clienteSchema = new Schema({
  firstname: String,
  lastname: String,
  dni: String,
  phone: String,
  email: String,
  address: String,
  country: String,
  town: String,
  state: String,
  postalcode: String,
});

const schema = new mongoose.Schema({
  id: Number,
  codigo: String,
  culqui: String,
  validateNubeFact: Number,
  codigoFact: String,
  estado: String,
  total: Number,
  detalle: [productoSchema],
  customerDetail: clienteSchema,
  fechaCrea: Date,
});

const OrdenCompra = mongoose.model("ordenCompra", schema);

exports.OrdenCompra = OrdenCompra;
