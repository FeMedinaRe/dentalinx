const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  categoria: {
    type: ObjectId,
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model("productos", Schema);
