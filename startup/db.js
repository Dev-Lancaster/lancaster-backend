const mongoose = require("mongoose");
const { MONGO_URL } = require("./db_url");

module.exports = function () {
  mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
