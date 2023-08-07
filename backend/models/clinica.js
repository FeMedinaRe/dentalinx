const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clinicaSchema = new Schema({
    nombreClinica:{
        type: String,
        required: true
    },
    telefono:{
        type: String,
        required: true
    },
    rutClinica:{
        type: String,
        required: true
    },
    direccionClinica:{
        type: String,
        required: true
    },
    correoClinica:{
        type: String,
        required: true
    },
    rutDueno:{
        type: String,
        required: true
    }
});
module.exports = mongoose.model('clinicas',clinicaSchema);