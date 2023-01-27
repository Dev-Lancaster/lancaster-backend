const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  tipo: String,
  url: String,
});

const ImagenesSistema = mongoose.model(
  "imagenesSistema",
  schema,
  "imagenesSistema"
);

exports.ImagenesSistema = ImagenesSistema;
