const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tratamientoSchema = new Schema({
    nombre: {
        type: String,
        required: true,
    },
    costo: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: false,
    },
    duracion: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("tratamientos", tratamientoSchema);
