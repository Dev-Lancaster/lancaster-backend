const express = require("express");
const router = express.Router();
const UsuarioService = require("../../services/admin/UsuarioService");

router.post("/", async (req, res) => {
  const { correo, password } = req.body;
  //password: "Prueba1#",
  const result = await UsuarioService.validateCredentials(correo, password);
  if (result.type === "SUCCESS") res.send(result);
  else res.send(result);
});

module.exports = router;
