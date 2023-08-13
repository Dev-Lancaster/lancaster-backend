const express = require("express");
const router = express.Router();
const tarifaService = require("../../services/ecommerce/tarifaService");

router.get("/find", async (req, res) => {
  const result = await tarifaService.findTarifas();
  res.send(result);
});

module.exports = router;
