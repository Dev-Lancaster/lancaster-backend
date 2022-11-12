const express = require("express");
const router = express.Router();
const UsuarioService = require("../../services/admin/UsuarioService");
const UserShopService = require("../../services/ecommerce/userShopService");
const bcrypt = require("bcryptjs");

router.post("/login", async (req, res) => {
  const { correo, password } = req.body;
  const user = await UserShopService.findByEmail(correo);
  if (!user)
    res.send({
      token: null,
      type: "ERROR",
      message: "Usuario y/o contraseña incorrecta",
    });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    res.send({
      token: null,
      type: "ERROR",
      message: "Usuario y/o contraseña incorrecta",
    });

  const token = user.generateAuthToken();
  res.send({
    type: "SUCCESS",
    token: token,
    nombre: user.firstname + " " + user.lastname,
    correo: user.email,
    id: user._id,
  });
});

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
