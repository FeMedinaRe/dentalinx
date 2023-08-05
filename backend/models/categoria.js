const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const categoriaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("categorias", categoriaSchema);
