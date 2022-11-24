const { Usuario } = require("../../models/usuario");
const bcrypt = require("bcryptjs");

const specialCharacter = [
  "#",
  "$",
  "%",
  "&",
  "?",
  "¿",
  "¡",
  "!",
  ".",
  ",",
  ";",
  "(",
  ")",
  "[",
  "]",
  "{",
  "}",
];

const number = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

async function findById(id) {
  const user = await Usuario.findById(id);
  return user;
}

async function findRecibe() {
  return await Usuario.findOne({ recibe: true });
}

async function findAll() {
  const list = await Usuario.find().sort({ nombre: 1 }).lean();
  return list;
}

async function findByCorreo(correo) {
  if (!correo) return null;
  let correoLow = correo.toLowerCase();
  const user = await Usuario.findOne({ correo: correoLow });
  return user;
}

async function update(id, model) {
  //const salt = await bcrypt.genSalt(10);
  //model.password = await bcrypt.hash(model.password, salt);
  await Usuario.findByIdAndUpdate(id, model);
  return { type: "SUCCESS" };
}

async function createUser(model) {
  let user = await findByCorreo(model.correo);
  if (user) return { type: "NOT-VALID", message: "El usuario ya existe" };

  const pwdValid = validatePassword(model.password);
  if (pwdValid.type !== "SUCCESS")
    return { type: pwdValid.type, message: pwdValid.message };

  user = new Usuario(model);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user = await user.save();
  const token = user.generateAuthToken();

  return { type: "SUCCESS", token: token, user: user };
}

function validatePassword(password) {
  if (!password)
    return { type: "NOT-VALID", message: "La contraseña esta vacia" };

  const csc = specialCharacter.some((element) => {
    if (password.indexOf(element) !== -1) return true;
    return false;
  });
  if (!csc)
    return {
      type: "NOT-VALID",
      message: "La contraseña debe tener al menos un carácter especial",
    };

  const cn = number.some((element) => {
    if (password.indexOf(element) !== -1) return true;
    return false;
  });
  if (!cn)
    return {
      type: "NOT-VALID",
      message: "La contraseña debe tener al menos un número",
    };

  const cu = /[A-Z]/.test(password);
  if (!cu)
    return {
      type: "NOT-VALID",
      message: "La contraseña debe tener al menos una letra mayúscula",
    };

  return {
    type: "SUCCESS",
    message: "",
  };
}

exports.findById = findById;
exports.findByCorreo = findByCorreo;
exports.createUser = createUser;
exports.validatePassword = validatePassword;
exports.findAll = findAll;
exports.update = update;
exports.findRecibe = findRecibe;
