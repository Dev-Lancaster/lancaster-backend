const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  fechaCrea: Date,
});

const Error = mongoose.model("error", schema);

exports.Error = Error;
