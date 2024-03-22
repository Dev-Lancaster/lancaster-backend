const express = require("express");
const router = express.Router();
const multer = require("multer");
const NodeCache = require("node-cache");
const paginaService = require("../../services/ecommerce/paginaService");

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 12000 });

const upload = multer({
  dest: "./upload",
});

router.get("/titulo/home/i", async (req, res) => {
  const cacheKey = "/titulo/home/i";
  const cachedData = cache.get(cacheKey);
  if (cachedData) res.send(cachedData);
  else {
    const result = await paginaService.findOneByTema("Tema Principal I");
    cache.set(cacheKey, result);
    res.send(result);
  }
});

router.get("/titulo/home/ii", async (req, res) => {
  const cacheKey = "/titulo/home/ii";
  const cachedData = cache.get(cacheKey);
  if (cachedData) res.send(cachedData);
  else {
    const result = await paginaService.findOneByTema("Tema Principal II");
    cache.set(cacheKey, result);
    res.send(result);
  }
});

router.get("/contactanos/correo", async (req, res) => {
  const cacheKey = "/contactanos/correo";
  const cachedData = cache.get(cacheKey);
  if (cachedData) res.send(cachedData);
  else {
    const result = await paginaService.findOneByTema("Contáctanos: correo");
    cache.set(cacheKey, result);
    res.send(result);
  }
});

router.get("/contactanos/telefono", async (req, res) => {
  const cacheKey = "/contactanos/telefono";
  const cachedData = cache.get(cacheKey);
  if (cachedData) res.send(cachedData);
  else {
    const result = await paginaService.findOneByTema("Contáctanos: teléfono");
    cache.set(cacheKey, result);
    res.send(result);
  }
});

router.get("/contactanos/direccion", async (req, res) => {
  const cacheKey = "/contactanos/direccion";
  const cachedData = cache.get(cacheKey);
  if (cachedData) res.send(cachedData);
  else {
    const result = await paginaService.findOneByTema("Contáctanos: Dirección");
    cache.set(cacheKey, result);
    res.send(result);
  }
});

router.get("/pie/pagina", async (req, res) => {
  const cacheKey = "/pie/pagina";
  const cachedData = cache.get(cacheKey);
  if (cachedData) res.send(cachedData);
  else {
    const result = await paginaService.findOneByTema("Pie de pagina");
    cache.set(cacheKey, result);
    res.send(result);
  }
});

router.get("/nuestra/historia", async (req, res) => {
  const cacheKey = "/nuestra/historia";
  const cachedData = cache.get(cacheKey);
  if (cachedData) res.send(cachedData);
  else {
    const result = await paginaService.findOneByTema("Nuestra historia");
    cache.set(cacheKey, result);
    res.send(result);
  }
});

router.get("/parallax", async (req, res) => {
  const cacheKey = "/parallax";
  const cachedData = cache.get(cacheKey);
  if (cachedData) res.send(cachedData);
  else {
    const result = await paginaService.findOneByTema("Parallax");
    cache.set(cacheKey, result);
    res.send(result);
  }
});

router.get("/compromiso/social", async (req, res) => {
  const cacheKey = "/compromiso/social";
  const cachedData = cache.get(cacheKey);
  if (cachedData) res.send(cachedData);
  else {
    const result = await paginaService.findOneByTema("Compromiso social");
    cache.set(cacheKey, result);
    res.send(result);
  }
});

router.get("/acerca/segunda", async (req, res) => {
  const cacheKey = "/acerca/segunda";
  const cachedData = cache.get(cacheKey);
  if (cachedData) res.send(cachedData);
  else {
    const result = await paginaService.findOneByTema(
      "Acerca de segunda sección"
    );
    cache.set(cache, result);
    res.send(result);
  }
});

router.get("/empleados", async (req, res) => {
  const cacheKey = "/empleados";
  const cachedData = cache.get(cacheKey);
  if (cachedData) res.send(cachedData);
  else {
    const result = await paginaService.findByTema("Empleados");
    cache.set(cacheKey, result);
    res.send(result);
  }
});

router.get("/acerca/encabezado", async (req, res) => {
  const cacheKey = "/acerca/encabezado";
  const cachedData = cache.get(cacheKey);
  if (cachedData) res.send(cachedData);
  else {
    const result = await paginaService.findByTema("Acerca de encabezado");
    cache.set(cacheKey, result);
    res.send(result);
  }
});

router.get("/collection/type", async (req, res) => {
  const cacheKey = "/collection/type";
  const cachedData = cache.get(cacheKey);
  if (cachedData) res.send(cachedData);
  else {
    const result = await paginaService.findByTema("Collection Type");
    cache.set(cacheKey, result);
    res.send(result);
  }
});

router.get("/collection", async (req, res) => {
  const cacheKey = "collection";
  const cachedData = cache.get(cacheKey);
  if (cachedData) res.send(cachedData);
  else {
    const result = await paginaService.findByTema("Collection");
    cache.set(cacheKey, result);
    res.send(result);
  }
});

router.get("/slider", async (req, res) => {
  const cacheKey = "/slider";
  const cachedData = cache.get(cacheKey);
  if (cachedData) res.send(cachedData);
  else {
    const result = await paginaService.findByTema("Slider");
    cache.set(cacheKey, result);
    res.send(result);
  }
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
