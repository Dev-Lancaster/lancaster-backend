const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const express = require("express");

module.exports = function (app) {
  app.use(cors());
  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: "500mb" }));
  app.use(express.urlencoded({ limit: "500mb", extended: true }));
  app.use(express.static("upload"));
};
