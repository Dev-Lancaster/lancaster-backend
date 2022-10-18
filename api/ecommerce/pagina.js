const express = require("express");
const router = express.Router();
const multer = require("multer");
const paginaService = require("../../services/ecommerce/paginaService");

const upload = multer({
  dest: "./upload",
});

router.get("/", async (req, res) => {
  const result = await paginaService.findAll(id);
  res.send(result);
});

router.post("/", upload.any(), async (req, res) => {
  const files = req.files;
  let body = req.body;
  body.fotos = files;

  try {
    const result = await paginaService.save(body);
    res.send({ type: "SUCCESS", model: result });
  } catch (e) {
    console.error(e);
    res.send({ type: "ERROR" });
  }
});

module.exports = router;
