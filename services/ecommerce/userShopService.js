const bcrypt = require("bcryptjs");
const { UserShop } = require("../../models/userShop");
const { OrdenCompra } = require("../../models/ordenCompra");
const { Producto } = require("../../models/producto");

async function findByEmail(email) {
  const emailLowerCase = email.toLowerCase();
  const model = await UserShop.findOne({ email: emailLowerCase });
  return model;
}

async function getOrdenCompra(email) {
  const user = await findByEmail(email);
  if (user) {
    const list = await OrdenCompra.find({ userShop: user._id })
      .sort({ date: -1 })
      .lean();

    let result = [],
      productos = [];
    let producto;

    for (const model of list) {
      productos = [];
      for (const p of model.products) {
        producto = await Producto.findById(p.producto);
        productos.push({
          producto: producto.nombre,
          categoriaPadre: producto.categoriaNombre,
          categoriaHija: producto.categoriaHijaNombre,
          talla: producto.talla,
          color: producto.color,
          precio: p.precio,
          cantidad: p.cantidad,
        });
      }
      result.push({ ...model, productos: productos });
    }
    return result;
  } else return null;
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
    return { type: "SUCCESS", msg: "", model: body };
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
  await UserShop.findByIdAndUpdate(id, model);
  return await UserShop.findById(id);
}

exports.findAll = findAll;
exports.findById = findById;
exports.save = save;
exports.update = update;
exports.getOrdenCompra = getOrdenCompra;
exports.findByEmail = findByEmail;
