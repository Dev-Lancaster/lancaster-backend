const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const express = require("express");

module.exports = function (app) {
  app.use(cors());
  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ limit: "100mb", extended: true }));
};
