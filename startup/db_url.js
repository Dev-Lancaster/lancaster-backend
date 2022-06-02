const config = require("config");

/*const MONGO_URL = `mongodb+srv://${config.get("database.user")}:${config.get(
  "database.password"
)}@cluster0.kc8kbjs.mongodb.net/${config.get(
  "database.name"
)}?retryWrites=true&w=majority`;*/

const MONGO_URL = `mongodb+srv://isacaster:CasterIsa89@cluster0.kc8kbjs.mongodb.net/HORUS_DESA?retryWrites=true&w=majority`;

exports.MONGO_URL = MONGO_URL;
