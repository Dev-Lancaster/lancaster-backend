const express = require("express");
const router = express.Router();
const UserShopService = require("../../services/ecommerce/userShopService");

router.get("/orden/:mail", async (req, res) => {
  const mail = req.params.mail;
  const result = await UserShopService.getOrdenCompra(mail);
  res.send(result);
});

router.get("/", async (req, res) => {
  const result = await UserShopService.findAll();
  res.send(result);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await UserShopService.findById(id);
  res.send(result);
});

router.post("/", async (req, res) => {
  const body = req.body;
  const result = await UserShopService.save(body);
  res.send(result);
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const result = await UserShopService.update(id, body);
  res.send(result);
});

module.exports = router;
