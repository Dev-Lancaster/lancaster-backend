const express = require("express");
const router = express.Router();
const UsuarioService = require("../../services/admin/UsuarioService");

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await UsuarioService.findById(id);
  res.send(result);
});

router.get("/", async (req, res) => {
  const result = await UsuarioService.findAll();
  res.send(result);
});

router.post("/", async (req, res) => {
  const result = await UsuarioService.createUser(req.body);
  res.send(result);
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const result = await UsuarioService.update(id, body);
  res.send(result);
});

module.exports = router;
