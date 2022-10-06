const error = require("../middleware/error");
const auth = require("../api/common/auth");
const categoria = require("../api/ecommerce/categoria");
const producto = require("../api/ecommerce/producto");
const fotos = require("../api/ecommerce/fotos");
const talla = require("../api/admin/talla");
const descuento = require("../api/ecommerce/descuento");
const ordenCompra = require("../api/ecommerce/ordenCompra");

module.exports = function (app) {
  app.use("/orden", ordenCompra);
  app.use("/descuento", descuento);
  app.use("/talla", talla);
  app.use("/fotos", fotos);
  app.use("/producto", producto);
  app.use("/categoria", categoria);
  app.use("/auth", auth);
  app.use(error);
};
