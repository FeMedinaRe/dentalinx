const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//terminar estoo

const pacienteSchema = new Schema({

    rut: {
        type: String,
        require : true
    },
    nombre: {
        type :String,
        require : true
    },
    direccion: {
        type: String,
        require : false
    },
    edad: {
        type: Number,
        requiere : true
    },
    saldo: {
        type: Number,
        require : true
    }
})

module.exports = mongoose.model('paciente', pacienteSchema);