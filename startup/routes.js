const error = require("../middleware/error");

module.exports = function (app) {
  app.use(error);
};
