const express = require("express");
const router = express.Router();
const errorService = require("../../services/admin/ErrorService");

router.post("/", async (req, res) => {
  const { titulo, descripcion } = req.body;
  const result = await errorService.save(titulo, descripcion);
  res.send(result);
});

module.exports = router;
