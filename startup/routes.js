const error = require("../middleware/error");
const auth = require("../api/common/auth");
const categoria = require("../api/ecommerce/categoria");
const producto = require("../api/ecommerce/producto");
const fotos = require("../api/ecommerce/fotos");

module.exports = function (app) {
  app.use("/fotos", fotos);
  app.use("/producto", producto);
  app.use("/categoria", categoria);
  app.use("/auth", auth);
  app.use(error);
};
