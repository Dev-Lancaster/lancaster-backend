const express = require("express");
const router = express.Router();
const productoInvService = require("../../services/ecommerce/productoInvService");

router.get("/reservar/:id/:cantidad", async (req, res) => {
  const { id, cantidad } = req.params;
  const result = await productoInvService.reservar(id, parseInt(cantidad));
  res.send(result);
});

router.get("/liberar/:id/:cantidad", async (req, res) => {
  const { id, cantidad } = req.params;
  const result = await productoInvService.liberar(id, parseInt(cantidad));
  res.send(result);
});

module.exports = router;
