const mongoose = require("mongoose");

//constructor para generar el schema
const Schema = mongoose.Schema;

const tratamientoSchema = new Schema({

    //Pasamos la estructura JSON que define el documento
    
    nombre: {
      type: Object,
      required: true,
    },
    costo: {
      type: String,
      required: false,
    },
    descripcion: {
      type: String,
      requiered: true,
    },
    duracion: {
      type: String,
      required: true,
    },
  });
  
  module.exports = mongoose.model("tratamiento", tratamientoSchema);