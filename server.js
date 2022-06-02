const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/config")(app);
require("./startup/routes")(app);

module.exports = app;
