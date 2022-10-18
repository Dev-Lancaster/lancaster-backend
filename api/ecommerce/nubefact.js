const express = require("express");
const router = express.Router();
const OrdenCompraService = require("../../services/ecommerce/ordenCompraService");

router.post("/nubefact", async (req, res) => {
  const body = req.body;
  try {
    const result = await OrdenCompraService.prepareFactura(body);
    res.send({ type: "SUCCESS", factura: result });
  } catch (e) {
    console.error(e);
    res.send({
      type: "ERROR",
      factura: null,
      message: "Ha ocurrido un error interno",
    });
  }
});

module.exports = router;
