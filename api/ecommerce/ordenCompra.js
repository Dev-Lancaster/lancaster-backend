const express = require("express");
const router = express.Router();
const OrdenCompraService = require("../../services/ecommerce/ordenCompraService");

router.post("/ordenado", async (req, res) => {
  const body = req.body;
  try {
    const result = await OrdenCompraService.generateOrdenado(body);
    res.send({ body: result, type: "SUCCESS" });
  } catch (e) {
    console.error(e);
    res.send({ type: "ERROR" });
  }
});

router.put("/pagado/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  try {
    const result = await OrdenCompraService.generatePagado(id, body);
    res.send({ body: result, type: "SUCCESS" });
  } catch (e) {
    console.error(e);
    res.send({ type: "ERROR" });
  }
});

router.put("/facturado/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  try {
    const result = await OrdenCompraService.generateFacturado(id, body);
    res.send({ body: result, type: "SUCCESS" });
  } catch (e) {
    console.error(e);
    res.send({ type: "ERROR" });
  }
});

module.exports = router;
