const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;


const practicanteSchema = new Schema({
  rut: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
  },
  idcarrera: {
    type: ObjectId,
    required: true,
  },
  iduniversidad: {
    type: ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("practicantes", practicanteSchema);
