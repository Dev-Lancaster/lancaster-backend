const express = require("express");
const router = express.Router();
const OrdenCompraService = require("../../services/ecommerce/ordenCompraService");

router.post("/:id", async (req, res) => {
  const body = req.body;
  const idOrden = req.params.id;
  try {
    const ordenCompra = await OrdenCompraService.findById(idOrden);
    if (!ordenCompra)
      return {
        type: "ERROR",
        factura: null,
        message: "No se pudo encontrar la orden de compra",
      };

    const flagBody = await OrdenCompraService.updateNubefactBody(idOrden, body);
    if (!flagBody)
      return {
        type: "ERROR",
        factura: null,
        message:
          "No se pudo actualizar la orden con los datos que se desean comprar",
      };

    const result = await OrdenCompraService.prepareFactura(body);
    if (result && result.errors && result.codigo && result.codigo === 21) {
      await OrdenCompraService.errorNubefact(idOrden, result);
      res.send({
        type: "ERROR",
        factura: result,
        message: "Ha ocurrido un error interno",
      });
    }
    console.log("5");
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
