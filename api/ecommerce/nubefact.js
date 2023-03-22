const express = require("express");
const router = express.Router();
const errorService = require("../../services/admin/ErrorService");
const OrdenCompraService = require("../../services/ecommerce/ordenCompraService");

router.post("/:id", async (req, res) => {
  const body = req.body;
  const idOrden = req.params.id;
  try {
    const ordenCompra = await OrdenCompraService.findById(idOrden);
    if (!ordenCompra) {
      await errorService.save(`/nubefact/${req.params.id} - Linea 12`, idOrden);
      res.send({
        type: "ERROR",
        factura: null,
        message: "No se pudo encontrar la orden de compra",
      });
    }

    const flagBody = await OrdenCompraService.updateNubefactBody(idOrden, body);
    if (!flagBody) {
      await errorService.save(`/nubefact/${req.params.id} - Linea 22`, idOrden);
      res.send({
        type: "ERROR",
        factura: null,
        message:
          "No se pudo actualizar la orden con los datos que se desean comprar",
      });
    }

    const result = await OrdenCompraService.prepareFactura(body);
    if (result && result.errors && result.codigo && result.codigo === 21) {
      await OrdenCompraService.errorNubefact(idOrden, result);
      await errorService.save(`/nubefact/${req.params.id} - Linea 34`, idOrden);
      res.send({
        type: "ERROR",
        factura: result,
        message: "Ha ocurrido un error interno",
      });
    }
    res.send({ type: "SUCCESS", factura: result });
  } catch (e) {
    console.error(e);
    await errorService.save(`/nubefact/${req.params.id}`, e.message);
    res.send({
      type: "ERROR",
      factura: null,
      message: "Ha ocurrido un error interno",
    });
  }
});

module.exports = router;
