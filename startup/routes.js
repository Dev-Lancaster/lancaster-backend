const error = require("../middleware/error");
const auth = require("../api/common/auth");
const categoria = require("../api/ecommerce/categoria");

module.exports = function (app) {
  app.use("/categoria", categoria);
  app.use("/auth", auth);
  app.use(error);
};
