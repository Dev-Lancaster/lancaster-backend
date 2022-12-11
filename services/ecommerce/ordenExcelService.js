const { UserShop } = require("../../models/userShop");
const { OrdenCompra } = require("../../models/ordenCompra");
const { Producto } = require("../../models/producto");

async function generateResumen(month, year) {}

async function findOrden(month, year) {
  const ini = new Date(year, month - 1, 1, -6, 0, 0);
  const end = new Date(year, month + 1, 0, -6, 0, 0);

  const result = await OrdenCompra.find({
    date: {
      $gte: ini,
      $lt: end,
    },
  })
    .sort({ date: 1 })
    .lean();
  return result;
}

exports.findOrden = findOrden;
