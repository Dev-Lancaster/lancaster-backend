const error = require("../middleware/error");
const auth = require("../api/common/auth");

module.exports = function (app) {
  app.use("/auth", auth);
  app.use(error);
};
