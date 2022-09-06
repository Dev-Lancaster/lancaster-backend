const express = require("express");
const router = express.Router();
const TallaService = require("../../services/admin/TallaService");

router.get("/", async (req, res) => {
  const result = await TallaService.findAll();
  res.send(result);
});

router.get("/active", async (req, res) => {
  const result = await TallaService.findActive();
  res.send(result);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await TallaService.findById(id);
  if (result) res.send(result);
  else res.status(204).send({ type: "NOT-FOUND" });
});

router.post("/", async (req, res) => {
  const body = req.body;
  const result = await TallaService.save(body);
  res.send(result);
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const result = await TallaService.update(id, body);
  res.send(result);
});

module.exports = router;
