const winston = require("winston");

module.exports = function (err, req, res, next) {
  winston.error(err.message, err);
  res.status(500).send("Houston! Tenemos un problema", err.message);
};
