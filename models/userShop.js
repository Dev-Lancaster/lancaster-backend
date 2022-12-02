const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

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
  district: String,
  postalcode: String,
  password: String,
  dateCreation: Date,
});

schema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      firstname: this.firstname,
    },
    "ruinas_teotihuacan"
  );
  return token;
};

const UserShop = mongoose.model("userShop", schema);

exports.UserShop = UserShop;
