const express = require("express");
const router = express.Router();
const reclamoService = require("../../services/ecommerce/reclamoService");
const errorService = require("../../services/admin/ErrorService");

router.get("/email/:email", async (req, res) => {
  const email = req.params.email;
  const result = await reclamoService.findByEmail(email);
  res.send(result);
});

router.post("/", async (req, res) => {
  try {
    let body = req.body;
    const model = await reclamoService.save(body);
    await reclamoService.sendEmail(model);
    res.send({
      type: "SUCCESS",
      message: "Se ha guardado correctamente el reclamo",
    });
  } catch (e) {
    await errorService.save("reclamo.js / router", e.message);
    console.error(e);
    res.send({
      type: "ERROR",
      message: "Ha ocurrido un error al tratar de guardar el reclamo",
    });
  }
});

module.exports = router;
