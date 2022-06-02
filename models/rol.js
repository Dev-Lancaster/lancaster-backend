const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
});

const Rol = mongoose.model("rol", schema);

exports.Rol = Rol;
