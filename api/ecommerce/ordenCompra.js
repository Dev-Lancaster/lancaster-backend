const express = require("express");
const router = express.Router();
const OrdenCompraService = require("../../services/ecommerce/ordenCompraService");

router.get("/", async (req, res) => {
  const result = await OrdenCompraService.findAll();
  res.send(result);
});

router.post("/ordenado", async (req, res) => {
  const body = req.body;
  try {
    const result = await OrdenCompraService.generateOrdenado(body);
    res.send(result);
  } catch (e) {
    console.error(e);
    res.send({
      type: "ERROR",
      orden: null,
      message: "Ha ocurrido un error interno",
    });
  }
});

router.put("/pagado/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  try {
    const result = await OrdenCompraService.generatePagado(id, body);
    res.send(result);
  } catch (e) {
    console.error(e);
    res.send({
      type: "ERROR",
      orden: null,
      message: "Ha ocurrido un error interno",
    });
  }
});

router.put("/facturado/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  try {
    const result = await OrdenCompraService.generateFacturado(id, body);
    await OrdenCompraService.sendMailFacturado(result.orden);
    res.send(result);
  } catch (e) {
    console.error(e);
    res.send({
      type: "ERROR",
      orden: null,
      message: "Ha ocurrido un error interno",
    });
  }
});

module.exports = router;
