const bcrypt = require("bcryptjs");
const { UserShop } = require("../../models/userShop");
const { OrdenCompra } = require("../../models/ordenCompra");

async function getOrdenCompra(userId) {
  return await OrdenCompra.find({ userShop: userId }).sort({ date: -1 }).lean();
}

async function findAll() {
  return await UserShop.find().sort({ firstname: 1, lastname: 1 }).lean();
}

async function findById(id) {
  return await UserShop.findById(id).lean();
}

async function save(model) {
  const exist = await existUser(model);
  if (!exist) {
    model.password = await encrypt(model.password);
    model.email = model.email.toLowerCase();
    model.dateCreation = new Date();
    let body = new UserShop(model);
    await body.save();
    return { type: "SUCCESS", model: body };
  } else return { type: "EXIST", msg: "Ya existe un usuario con este correo." };
}

async function encrypt(text) {
  const salt = await bcrypt.genSalt(10);
  const textEncrypt = await bcrypt.hash(text, salt);
  return textEncrypt;
}

async function existUser(model) {
  const body = await UserShop.findOne({
    email: model.email.toLowerCase(),
  }).lean();
  if (body) return true;
  else return false;
}

async function update(id, model) {
  return await UserShop.findByIdAndUpdate(id, model);
}

exports.findAll = findAll;
exports.findById = findById;
exports.save = save;
exports.update = update;
exports.getOrdenCompra = getOrdenCompra;
