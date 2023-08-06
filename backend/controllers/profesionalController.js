const Profesional = require("../models/profesional");
const { validate, clean, format, getCheckDigit } = require('rut.js');

const createProfesional = async (req,res) => {
    try{
        const {rut,nombre, direccion, edad, especialidad, correo, sexo } = req.body
    const newProfesional = new Profesional({
        rut,
        nombre,
        direccion,
        edad,
        especialidad,
        correo,
        sexo
    })


    const validarCorreo = (correo)=>{
        let expReg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
        let verificar = expReg.test(correo)
        if(!verificar){
            throw new Error("El correo es invalido")
        }
    }
    validarCorreo(correo)


    const validarRutt=(rut)=>{
        if(!validate(rut)){
            throw new Error("El rut es invalido")
        }
    }
    validarRutt(rut)


    const validarNombre = (nombre)=>{
        let regex = /^[a-zA-ZÀ-ÿ ]+$/;
        if(!regex.test(nombre)){
        throw new Error("Nombre ingresado NO valido")
        }
        if(nombre.length>100 || nombre.length<1){
        throw new Error("Cantidad de caracteres no valida")
        }

    }
    validarNombre(nombre)

    const validarDireccion= (direccion)=>{
        if(direccion.length>100 || direccion.length<1){
            throw new Error ("Cantidad de caracteres no valida")
        }
    }
    validarDireccion(direccion)

    const validarEspecialidad= (especialidad)=>{
        if(especialidad.length>100 || especialidad.length<1){
            throw new Error ("Cantidad de caracteres no valida")
        }
    }

    validarEspecialidad(especialidad)

    const profesional = await newProfesional.save();

    return res.status(201).send(profesional);
    }catch(error){
        return res.status(400).send({ message: error.message });
    }

}

const getPorNombre = async (req, res) => {
    const nombre = req.params.nombre;
    try {
    const profesional = await Profesional.findOne({ nombre: nombre }).exec();
    if (!profesional) {
        return res.status(404).send({ message: "No se ha encontrado el profesional" });
    }
    return res.status(201).send(profesional);
    } catch (error) {
    return res.status(400).send({ message: "No se ha podido realizar la busqueda" });
    }
};

const getProfesionales= async (req,res) => {

    try {
        const profesionales = await Profesional.find().exec();

        if (profesionales.length === 0) {
        return res.status(404).send({ message: "No se han encontrado profesionales" });
        }

        return res.status(200).send(profesionales);
    } catch (error) {
        return res.status(400).send({ message: "No se realizó la búsqueda" });
    }

}

async function validarDatosUpdate(direccion, edad, especialidad) {

    if(direccion.length>100 || direccion.length<1){
        throw new Error ("Cantidad de caracteres no valida")
    }

    if (edad < 0 || edad > 150) {
    throw new Error("La edad ingresada no es valida");
    }

    if(especialidad.length>100 || especialidad.length<1){
        throw new Error ("Cantidad de caracteres no valida")
    }
}

const updateProfesional= async (req, res)=> {
   
    try {
        const { id } = req.params;
        const { direccion, edad, especialidad } = req.body;
        console.log(req.params)
        console.log(req.body)

        await validarDatosUpdate(direccion , edad, especialidad);

        const profesional = await Profesional.findByIdAndUpdate(id, req.body, {
        new: true,
        });

        if (!profesional) {
        return res.status(404).send({ message: "No se encontró el profesional" });
        }

        return res.status(201).send(profesional);
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }

}

const deleteProfesional= async (req, res)=> {
    try {
        const { id } = req.params;
        const profesional = await Profesional.findByIdAndDelete(id);

        if (!profesional) {
        return res.status(404).send({ message: "No se encontró el profesional" });
        }

        return res.status(200).send({ message: "Profesional eliminado correctamente" });
    } catch (error) {
        return res.status(400).send({ message: "No fue posible eliminar el profesional" });
    }
}


module.exports = {
    createProfesional,
    getPorNombre,
    getProfesionales,
    updateProfesional,
    deleteProfesional,
};