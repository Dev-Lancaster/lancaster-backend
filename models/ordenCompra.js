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
  district: String,
});

const schema = new mongoose.Schema({
  id: Number,
  idBoleta: Number,
  orderId: String,
  culquiToken: String,
  nubefactNumero: Number,
  status: String,
  totalAmount: Number,
  tipoOrden: String,
  nubeFact: Object,
  products: [productoSchema],
  customerDetails: clienteSchema,
  mailRegister: String,
  userShop: { type: Schema.Types.ObjectId, ref: "userShop" },
  date: Date,
  bodyNubefact: Object,
});

const OrdenCompra = mongoose.model("ordenCompra", schema);

exports.OrdenCompra = OrdenCompra;
