const jwt = require("jsonwebtoken");

module.exports = async function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).send("Acceso denegado. El token no existe");
  try {
    const payload = jwt.verify(token, "ruinas_teotihuacan");
    req.user = payload;
    next();
  } catch (e) {
    res.status(400).send("Token invalido");
  }
};
