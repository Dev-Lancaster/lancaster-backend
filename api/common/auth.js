const express = require("express");
const router = express.Router();
const UsuarioService = require("../../services/admin/UsuarioService");
const bcrypt = require("bcryptjs");

router.post("/", async (req, res) => {
  const { correo, password } = req.body;
  const user = await UsuarioService.findByCorreo(correo);
  if (!user) {
    res.status(400).send("Usuario y/o contraseña incorrecta");
    return;
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    res.status(400).send("Usuario y/o contraseña incorrecta");
    return;
  }

  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
