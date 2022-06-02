require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const config = require("config");
const { MONGO_URL } = require("./db_url");

module.exports = function () {
  if (!config.get("general.jwt")) {
    winston.error("FATAL ERROR: no se ha definido la llave para el uso de JWT");
    process.exit(1);
  }

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  process.on("uncaughtException", function (err) {
    winston.error("Error inesperado", err);
  });

  winston.exceptions.handle(
    new winston.transports.MongoDB({ db: MONGO_URL, level: "warn" }),
    new winston.transports.Console({ format: winston.format.prettyPrint() })
  );

  winston.add(new winston.transports.MongoDB({ db: MONGO_URL, level: "warn" }));
  winston.add(
    new winston.transports.Console({ format: winston.format.prettyPrint() })
  );
};
