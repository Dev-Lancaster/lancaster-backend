const express = require("express");
const router = express.Router();
const ordenExcelService = require("../../services/ecommerce/ordenExcelService");

router.get("/extracto/month/:month/year/:year", async (req, res) => {
  const { month, year } = req.params;
  const result = await ordenExcelService.generateExtracto(month, year);
  res.send(result);
});

router.get("/resumen/month/:month/year/:year", async (req, res) => {
  const { month, year } = req.params;
  const result = await ordenExcelService.generateResumen(month, year);
  res.send(result);
});

module.exports = router;
