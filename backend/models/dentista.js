const mongoose = require("mongoose");

//constructor para generar el schema
const Schema = mongoose.Schema;

const dentistaSchema = new Schema({

    //Pasamos la estructura JSON que define el documento
    
    nombre: {
      type: String,
      required: true,
    },
    direccion: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      requiered: true,
    },
    especialidad: {
      type: String,
      required: true,
    },
    telefono: {
      type: String,
      required: true,
    },
    apellidos: {
      type: String,
      required: true,
    },
    celular: {
        type: String,
        required: true,
    },
    rut: {
        type: String,
        required: true,
      },
  });
  
  module.exports = mongoose.model("dentista", dentistaSchema);