const config = require("config");

const MONGO_URL = `mongodb+srv://${config.database.user}:${config.database.password}@cluster0.kc8kbjs.mongodb.net/${config.database.name}?retryWrites=true&w=majority`;

exports.MONGO_URL = MONGO_URL;
