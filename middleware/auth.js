const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = async function auth(req, res, next) {
  const token = req.header(config.get("general.token_alias"));
  if (!token)
    return res.status(401).send("Acceso denegado. El token no existe");
  try {
    const payload = jwt.verify(token, config.get("general.jwt"));
    req.user = payload;
    next();
  } catch (e) {
    res.status(400).send("Token invalido");
  }
};
