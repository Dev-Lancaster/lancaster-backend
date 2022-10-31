const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const ProductoService = require("../../services/ecommerce/productoService");
const ErrorService = require("../../services/admin/ErrorService");
const multer = require("multer");
const s3 = require("../../middleware/s3");

const upload = multer({
  dest: "./upload",
});

router.get("/s3/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await s3.getFileURL(id);
    res.json({ url: result });
  } catch (e) {
    console.error(e);
    res.send({ type: "ERROR" });
  }
});

/*********** ECOMMERCE ***********/
router.get("/ocupado/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const model = await ProductoService.setOcupado(id);
    res.send({ type: "SUCCESS", producto: model });
  } catch (e) {
    console.error(e);
    res.send({ type: "ERROR" });
  }
});

router.get("/all", async (req, res) => {
  const result = await ProductoService.findAllEcom();
  res.send(result);
});

router.get("/e/categoria/hija/:categoria", async (req, res) => {
  const categoria = req.params.categoria;
  const result = await ProductoService.findECategoriaHija(categoria);
  res.send(result);
});

router.get("/e/categoria/padre/:padre/hija/:hija", async (req, res) => {
  const { padre, hija } = req.params;
  const result = await ProductoService.findECategorias(padre, hija);
  res.send(result);
});

router.get("/e/etiqueta/:etiqueta", async (req, res) => {
  const { etiqueta } = req.params;
  const result = await ProductoService.findEByEtiqueta(etiqueta);
  res.send(result);
});

router.get("/e/categoria/padre/:categoria", async (req, res) => {
  const { categoria } = req.params;
  const result = await ProductoService.findEByCategoriaPadre(categoria);
  res.send(result);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await ProductoService.findEById(id);
  res.send(result);
});

router.get("/only/:id", async (req, res) => {
  const id = req.params.id;
  const result = await ProductoService.findById(id);
  res.send(result);
});

/*********** FIN ECOMMERCE ***********/

router.get("/sin/descuento", async (req, res) => {
  const result = await ProductoService.findActivosSinDescuento();
  res.send(result);
});

router.get("/distinct/code", auth, async (req, res) => {
  const result = await ProductoService.findDistinctCode();
  res.send(result);
});

router.get("/hija/:hija/estado/:estado", auth, async (req, res) => {
  const { hija, estado } = req.params;
  const result = await ProductoService.findProductoCategoriaHija(hija, estado);
  res.send(result);
});

router.get(
  "/padre/:padre/hija/:hija/estado/:estado",
  auth,
  async (req, res) => {
    const { padre, hija, estado } = req.params;
    const result = await ProductoService.findProductoCategorias(
      padre,
      hija,
      estado
    );
    res.send(result);
  }
);

router.get("/codigo/:codigo", auth, async (req, res) => {
  const codigo = req.params.codigo;
  const result = await ProductoService.findProductoByCodigo(codigo);
  res.send(result);
});

router.get("/etiqueta/:etiqueta/estado/:estado", auth, async (req, res) => {
  const { etiqueta, estado } = req.params;
  const result = await ProductoService.findByEtiquetaEstado(etiqueta, estado);
  res.send(result);
});

router.get("/estado/:estado", auth, async (req, res) => {
  const estado = req.params.estado;
  const result = await ProductoService.findByEstado(estado);
  res.send(result);
});

router.get("/categoria/:categoria/estado/:estado", auth, async (req, res) => {
  const { categoria, estado } = req.params;
  const result = await ProductoService.findByCategoriaEstado(categoria, estado);
  res.send(result);
});

router.get("/", auth, async (req, res) => {
  const result = await ProductoService.findAll();
  res.send(result);
});

router.post("/masivo/:user", auth, upload.any(), async (req, res) => {
  const files = req.files;
  try {
    const result = await ProductoService.prepareLoad(files, req.params.user);
    res.send(result);
  } catch (e) {
    await ErrorService.save("API /MASIVO/USER", e);
    res.send(e);
  }
});

router.post("/update/fotos/:id", auth, upload.any(), async (req, res) => {
  const files = req.files;
  const id = req.params.id;

  const result = await ProductoService.updateFotos(id, files);
  res.send(result);
});

router.post("/", auth, upload.any(), async (req, res) => {
  const files = req.files;
  const body = req.body;

  const result = await ProductoService.save(body, files);
  res.send(result);
});

router.put("/info/:id", auth, upload.any(), async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const result = await ProductoService.updateInfo(id, body);
  res.send(result);
});

router.put("/only/info/:id", auth, async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const result = await ProductoService.onlyUpdateInfo(id, body);
  res.send(result);
});

router.post("/all/update", auth, async (req, res) => {
  const body = req.body;
  try {
    for (const model of body)
      await ProductoService.onlyUpdateInfo(model._id, model);
    res.send({ type: "SUCCESS" });
  } catch (e) {
    console.error(e);
    res.send({ type: "ERROR" });
  }
});

router.put("/:id", auth, upload.any(), async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const result = await ProductoService.update(id, body);
  res.send(result);
});

router.put("/estado/:id", auth, async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const result = await ProductoService.changeEstado(id, body.estado);
  res.send(result);
});

router.delete("/foto/:id/:idFoto", auth, async (req, res) => {
  const { id, idFoto } = req.params;
  try {
    await ProductoService.deleteFoto(id, idFoto);
  } catch (e) {
    console.error(e);
    res.send({ type: "ERROR" });
  }
  res.send({ type: "OK" });
});

module.exports = router;
