const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const profesionalSchema = new Schema({
  rut: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  direccion: {
    type: String,
    required: false,
  },
  edad: {
    type: Number,
    requiered: true,
  },
  especialidad: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
  },
  sexo: {
    type: String,
    enum: ["Femenino", "Masculino", "Otro"],
    required: true,
  },
});

module.exports = mongoose.model("profesional", profesionalSchema);
