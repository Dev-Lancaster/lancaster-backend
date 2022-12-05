const express = require("express");
const router = express.Router();
const OrdenCompraService = require("../../services/ecommerce/ordenCompraService");

/**
 *    agregar campo de error en la orden
 *    recuperar el id en la url
 *    recuperar la orden de compra
 *    guardar el body que manda mauri en la orden de compra
 *    verificar si el nubefact dio error o no
 *    si si, poner un atributo en la orden que diga de ese error y mandar correo a valeria
 *    si da error mandar todo bien
 *    si todo sale bien mandar todo bien
 * en la api de facturado verificar si existe ese atributo para cambiar o no su estado a facturado
 * en la consulta de orden mostrar las que tuvieron error y cual es
 */

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
      await OrdenCompraService.errorNubefact(idOrden, body);
      return { type: "ERROR-NUBEFACT", factura: result, message: "" };
    }

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
