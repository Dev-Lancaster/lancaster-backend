const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
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
  dateCreation: Date,
});

const UserShop = mongoose.model("userShop", schema);

exports.UserShop = UserShop;
