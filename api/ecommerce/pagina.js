const express = require("express");
const router = express.Router();
const multer = require("multer");
const paginaService = require("../../services/ecommerce/paginaService");

const upload = multer({
  dest: "./upload",
});

router.get("/titulo/home/i", async (req, res) => {
  const result = await paginaService.findOneByTema("Tema Principal I");
  res.send(result);
});

router.get("/titulo/home/ii", async (req, res) => {
  const result = await paginaService.findOneByTema("Tema Principal II");
  res.send(result);
});

router.get("/contactanos/correo", async (req, res) => {
  const result = await paginaService.findOneByTema("Contáctanos: correo");
  res.send(result);
});

router.get("/contactanos/telefono", async (req, res) => {
  const result = await paginaService.findOneByTema("Contáctanos: teléfono");
  res.send(result);
});

router.get("/contactanos/direccion", async (req, res) => {
  const result = await paginaService.findOneByTema("Contáctanos: Dirección");
  res.send(result);
});

router.get("/pie/pagina", async (req, res) => {
  const result = await paginaService.findOneByTema("Pie de pagina");
  res.send(result);
});

router.get("/nuestra/historia", async (req, res) => {
  const result = await paginaService.findOneByTema("Nuestra historia");
  res.send(result);
});

router.get("/parallax", async (req, res) => {
  const result = await paginaService.findOneByTema("Parallax");
  res.send(result);
});

router.get("/compromiso/social", async (req, res) => {
  const result = await paginaService.findOneByTema("Compromiso social");
  res.send(result);
});

router.get("/acerca/segunda", async (req, res) => {
  const result = await paginaService.findOneByTema("Acerca de segunda sección");
  res.send(result);
});

router.get("/empleados", async (req, res) => {
  const result = await paginaService.findByTema("Empleados");
  res.send(result);
});

router.get("/acerca/encabezado", async (req, res) => {
  const result = await paginaService.findByTema("Acerca de encabezado");
  res.send(result);
});

router.get("/collection/type", async (req, res) => {
  const result = await paginaService.findByTema("Collection Type");
  res.send(result);
});

router.get("/collection", async (req, res) => {
  const result = await paginaService.findByTema("Collection");
  res.send(result);
});

router.get("/slider", async (req, res) => {
  const result = await paginaService.findByTema("Slider");
  res.send(result);
});

router.get("/:id", async (req, res) => {
  const result = await paginaService.findById(req.params.id);
  res.send(result);
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const result = await paginaService.update(id, body);
  res.send(result);
});

router.get("/delete/foto/:idPagina/:foto", async (req, res) => {
  const { idPagina, foto } = req.params;
  try {
    const result = await paginaService.removeFoto(idPagina, foto);
    res.send({ type: "SUCCESS", model: result });
  } catch (e) {
    console.error(e);
  }
  res.send({ type: "ERROR", message: "Ha ocurrido un error inesperado" });
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

router.post("/update/fotos/:id", upload.any(), async (req, res) => {
  const files = req.files;
  const id = req.params.id;

  try {
    const result = await paginaService.updateFotos(id, files);
    res.send(result);
  } catch (e) {
    console.error(e);
    res.send({ type: "ERROR", msg: "Ha ocurrido un error inesperado" });
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
