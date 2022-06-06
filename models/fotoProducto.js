const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  producto: { type: Schema.Types.ObjectId, ref: "producto" },
  img: { data: Buffer, contentType: String },
  principal: Boolean,
  usuarioCrea: String,
  fechaCrea: Date,
});

const FotoProducto = mongoose.model("fotoProducto", schema);

exports.FotoProducto = FotoProducto;