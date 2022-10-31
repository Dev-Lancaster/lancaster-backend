const express = require("express");
const router = express.Router();
const multer = require("multer");
const paginaService = require("../../services/ecommerce/paginaService");

const upload = multer({
  dest: "./upload",
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const result = await paginaService.update(id, body);
  res.send(result);
});

router.get("/", async (req, res) => {
  const result = await paginaService.findAll();
  res.send(result);
});

router.delete("/:id", async (req, res) => {
  try {
    await paginaService.remove(req.params.id);
    res.send({ type: "SUCCESS" });
  } catch (e) {
    res.send({ type: "ERROR" });
  }
});

router.post("/", upload.any(), async (req, res) => {
  const data = req.body;
  const body = {
    tema: data.tema,
    titulo: data.titulo,
    subtitulo: data.subtitulo,
    descripcion: data.descripcion,
    usuarioCrea: data.usuarioCrea,
    fotos: req.files,
  };
  try {
    const result = await paginaService.save(body);
    res.send({ type: "SUCCESS", model: result });
  } catch (e) {
    console.error(e);
    res.send({ type: "ERROR" });
  }
});

module.exports = router;
