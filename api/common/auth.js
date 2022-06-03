const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const UsuarioService = require("../../services/admin/UsuarioService");

router.post("/", auth, async (req, res) => {
  const { correo, password } = req.body;
  const result = await UsuarioService.validateCredentials(correo, password);

  if (result.type === "SUCCESS") res.send(result);
  else res.status(204).send(result);
});

module.exports = router;