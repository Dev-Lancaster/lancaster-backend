const express = require("express");
const router = express.Router();
const DescuentoService = require("../../services/ecommerce/descuentoService");

router.get("/inactivate/:codigo", async (req, res) => {
  const codigo = req.params.codigo;
  try {
    await DescuentoService.inactivate(codigo);
    res.send({ type: "SUCCESS" });
  } catch (e) {
    console.error(e);
    res.send({ type: "ERROR" });
  }
});

router.get("/", async (req, res) => {
  const result = await DescuentoService.findAll();
  res.send(result);
});

router.post("/", async (req, res) => {
  const body = req.body;
  try {
    await DescuentoService.save(body);
    res.send({ type: "SUCCESS" });
  } catch (e) {
    console.error(e);
    res.send({ type: "ERROR" });
  }
});

module.exports = router;
