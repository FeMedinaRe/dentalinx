const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//terminar estoo

const pacienteSchema = new Schema({
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
  saldo: {
    type: Number,
    required: true,
  },
  correo: {
    type: String,
    required: true,
  },
  fechaNacimiento: {
    // Nuevo campo para la fecha de nacimiento
    type: Date, // Utilizamos el tipo de dato 'Date' para almacenar fechas
    required: true,
  },
  sexo: {
    type: String,
    enum: ["Femenino", "Masculino", "Otro"],
    required: true,
  },
});

module.exports = mongoose.model("paciente", pacienteSchema);
