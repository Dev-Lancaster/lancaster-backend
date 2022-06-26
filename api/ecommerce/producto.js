const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const ProductoService = require("../../services/ecommerce/productoService");

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

router.get("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const result = await ProductoService.findById(id);
  res.send(result);
});

router.post("/", auth, async (req, res) => {
  const body = req.body;
  const result = await ProductoService.save(body);
  res.send(result);
});

router.put("/:id", auth, async (req, res) => {
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

module.exports = router;
