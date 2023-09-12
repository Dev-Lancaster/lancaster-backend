const express = require("express");
const router = express.Router();
const errorService = require("../../services/admin/ErrorService");
const OrdenCompraService = require("../../services/ecommerce/ordenCompraService");

router.put("/despachado/:id", async (req, res) => {
  const id = req.params.id;
  const result = await OrdenCompraService.despachado(id);
  res.send(result);
});

router.get("/", async (req, res) => {
  const result = await OrdenCompraService.findAll();
  res.send(result);
});

router.post("/ordenado", async (req, res) => {
  const body = req.body;
  try {
    const result = await OrdenCompraService.generateOrdenado(body);
    await errorService.save("/ordenado result", result.orden);
    res.send(result);
  } catch (e) {
    await errorService.save("/ordenado", e.message);
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
    await errorService.save(`/pagado/${id}`, e.message);
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
    const ordenCheck = await OrdenCompraService.findById(id);
    if (!ordenCheck) {
      await errorService.save(`/facturado/${id}`, "ordenCheck");
      res.send({
        type: "ERROR",
        orden: null,
        message: "Ha ocurrido un error interno",
      });
    } else if (ordenCheck.errorNubefact) {
      await errorService.save(`/facturado/${id}`, "errorNubefact");
      res.send({
        type: "ERROR",
        orden: null,
        message: "Ha ocurrido un error interno",
      });
    } else {
      const result = await OrdenCompraService.generateFacturado(id, body);
      await OrdenCompraService.sendMailFacturado(result.orden);
      res.send(result);
    }
  } catch (e) {
    console.error(e);
    await errorService.save(`/facturado/${id}`, e.message);
    res.send({
      type: "ERROR",
      orden: null,
      message: "Ha ocurrido un error interno",
    });
  }
});

module.exports = router;
