const express = require("express");
const router = express.Router();
const reclamoService = require("../../services/ecommerce/reclamoService");

router.get("/email/:email", async (req, res) => {
  const email = req.params.email;
  const result = await reclamoService.findByEmail(email);
  res.send(result);
});

router.post("/", async (req, res) => {
  try {
    let body = req.body;
    await reclamoService.save(body);
    res.send({
      type: "SUCCESS",
      message: "Se ha guardado correctamente el reclamo",
    });
  } catch (e) {
    console.error(e);
    res.send({
      type: "ERROR",
      message: "Ha ocurrido un error al tratar de guardar el reclamo",
    });
  }
});

module.exports = router;
