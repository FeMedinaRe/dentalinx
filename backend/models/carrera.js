const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;


const carreraSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("carrera", carreraSchema);