const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
//constructor para generar el schema
const Schema = mongoose.Schema;

const citaSchema = new Schema({

    //Pasamos la estructura JSON que define el documento
    
    paciente_id: {
      type: ObjectId,
      required: true,
    },
    dentista_id: {
      type: ObjectId,
      required: false,
    },
    tratamiento_id: {
      type: ObjectId,
      requiered: true,
    },
    fecha: {
      type: String,
      required: true,
    },
    hora: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      required: true,
    },
  });
  
  module.exports = mongoose.model("cita", citaSchema);