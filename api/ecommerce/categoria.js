const express = require("express");
const router = express.Router();
const CategoriaService = require("../../services/ecommerce/categoriaService");

router.get("/", async (req, res) => {
  const result = await CategoriaService.findAll();
  res.send(result);
});

router.get("/nivel/:nivel", async (req, res) => {
  const nivel = req.params.nivel;
  const result = await CategoriaService.findNivelActive(nivel);
  res.send(result);
});

router.get("/active", async (req, res) => {
  const result = await CategoriaService.findActive();
  res.send(result);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await CategoriaService.findById(id);
  if (result) res.send(result);
  else res.status(204).send({ type: "NOT-FOUND" });
});

router.post("/", async (req, res) => {
  const body = req.body;
  const result = await CategoriaService.save(body);
  res.send(result);
});

router.put("/inactive/:id", async (req, res) => {
  const id = req.params.id;
  const result = await CategoriaService.inactivate(id);
  res.send(result);
});

router.put("/activate/:id", async (req, res) => {
  const id = req.params.id;
  const result = await CategoriaService.activate(id);
  res.send(result);
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const result = await CategoriaService.update(id, body);
  res.send(result);
});

module.exports = router;
