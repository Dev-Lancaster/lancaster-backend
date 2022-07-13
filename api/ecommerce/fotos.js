const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../../middleware/auth");
const ProductoService = require("../../services/ecommerce/productoService");

const upload = multer({
  dest: "./upload",
});

router.get("/producto/:producto", async (req, res) => {
  const producto = req.params.producto;
  const result = await ProductoService.findFotos(producto);
  res.send(result);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await ProductoService.findFotoById(id);
  res.send(result);
});

router.delete("/producto/:id", async (req, res) => {
  const idProducto = req.params.id;
  const result = await ProductoService.deleteFotos(idProducto);
  res.send(result);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await ProductoService.deleteFoto(id);
  res.send(result);
});

router.post("/", upload.any(), async (req, res) => {
  const files = req.files;
  const { idProducto, usuario } = req.body;
  const result = await ProductoService.saveFoto(idProducto, files, usuario);
  res.send(result);
});

module.exports = router;
