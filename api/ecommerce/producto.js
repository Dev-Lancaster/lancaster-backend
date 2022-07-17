const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const ProductoService = require("../../services/ecommerce/productoService");

/*********** ECOMMERCE ***********/
router.get("/e/categoria/hija/:categoria", async (req, res) => {
  const categoria = req.params;
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
/*********** FIN ECOMMERCE ***********/

router.get("/hija/:hija/estado/:estado", async, auth, (req, res) => {
  const { hija, estado } = req.params;
  const result = await ProductoService.findProductoCategoriaHija(hija, estado);
  res.send(result);
});

router.get("/padre/:padre/hija/:hija/estado/:estado", async, auth, (req, res) => {
  const { padre, hija, estado } = req.params;
  const result = await ProductoService.findProductoCategorias(
    padre,
    hija,
    estado
  );
  res.send(result);
});

router.get("/codigo/:codigo", async, auth, (req, res) => {
  const codigo = req.params.codigo;
  const result = await ProductoService.findProductoByCodigo(codigo);
  res.send(result);
});

router.get("/etiqueta/:etiqueta/estado/:estado", async, auth, (req, res) => {
  const { etiqueta, estado } = req.params;
  const result = await ProductoService.findByEtiquetaEstado(etiqueta, estado);
  res.send(result);
});

router.get("/estado/:estado", async, auth, (req, res) => {
  const estado = req.params.estado;
  const result = await ProductoService.findByEstado(estado);
  res.send(result);
});

router.get("/categoria/:categoria/estado/:estado", async, auth, (req, res) => {
  const { categoria, estado } = req.params;
  const result = await ProductoService.findByCategoriaEstado(categoria, estado);
  res.send(result);
});

router.get("/:id", async, auth, (req, res) => {
  const id = req.params.id;
  const result = await ProductoService.findById(id);
  res.send(result);
});

router.post("/", async, auth, (req, res) => {
  const body = req.body;
  const result = await ProductoService.save(body);
  res.send(result);
});

router.put("/:id", async, auth, (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const result = await ProductoService.update(id, body);
  res.send(result);
});

router.put("/estado/:id", async, auth, (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const result = await ProductoService.changeEstado(id, body.estado);
  res.send(result);
});

module.exports = router;
