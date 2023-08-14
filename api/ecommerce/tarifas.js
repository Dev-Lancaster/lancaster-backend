const express = require("express");
const router = express.Router();
const tarifaService = require("../../services/ecommerce/tarifaService");

router.get("/find", async (req, res) => {
  const result = await tarifaService.findTarifas();
  res.send(result);
});

router.get("/", async (req, res) => {
  const result = await tarifaService.findAll();
  res.send(result);
});

router.get("/:id", async (req, res) => {
  const result = await tarifaService.findById(req.params.id);
  res.send(result);
});

router.put("/:id", async (req, res) => {
  const body = req.body;
  try {
    await tarifaService.update(req.params.id, body);
  } catch (e) {
    console.error(e);
    res.send({ type: "ERROR" });
  }
  res.send({ type: "SUCCESS" });
});

module.exports = router;
