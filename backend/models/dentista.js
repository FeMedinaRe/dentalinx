const mongoose = require("mongoose");

//constructor para generar el schema
const Schema = mongoose.Schema;

const dentistaSchema = new Schema({

    
    nombre: {
      type: String,
      required: true,
    },
    
  });
  
  module.exports = mongoose.model("dentista", dentistaSchema);