const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  password: String,
  nombre: String,
  correo: String,
  user: String,
  activo: Boolean,
  rol: String,
});

schema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      rol: this.rol,
      correo: this.correo,
      nombre: this.nombre,
    },
    "ruinas_teotihuacan"
  );
  return token;
};

const Usuario = mongoose.model("usuario", schema);

exports.Usuario = Usuario;
