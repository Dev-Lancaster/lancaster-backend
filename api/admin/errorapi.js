const express = require("express");
const router = express.Router();
const errorService = require("../../services/admin/ErrorService");

router.post("/", async (req, res) => {
  const body = req.body;
  const result = await errorService.save(body);
  res.send(result);
});

module.exports = router;
