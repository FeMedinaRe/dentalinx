const Tratamiento = require("../models/tratamientos");

async function validarDatosTratamientos(
    nombre,
    costo,
    descripcion,
    duracion
){   
    // const regexLetras = /^[A-Za-z\s]+$/;
    const regexCosto = /^\d+$/;

    if (nombre.length < 3){
        throw new Error("El nombre debe ser mayor a 2 caracteres")
    }
    
    if (!regexCosto.test(costo)){
        throw new Error("El costo es incorrecto");
    }

    if (descripcion.length < 5){
        throw new Error("La descripción es muy corta");
    }

    if (duracion.length == 0){
        throw new Error("Debe ingresar una duración");
    }
}

async function validarActualizacionDatos(duracion) {
  
  if (duracion.length < 8) {
    console.log("error duración");
    throw new Error("La duración no contiene los caracteres correctos");
  }
}

const createTratamiento = async (req, res) => {
    try {
      const { nombre, costo, descripcion, duracion } = req.body;
  
      await validarDatosTratamientos(nombre, costo, descripcion,duracion);
  
      const newTratamiento = new Tratamiento({nombre, costo, descripcion, duracion});
  
      const tratamiento = await newTratamiento.save();
  
      return res.status(201).send(tratamiento);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
};

const getTratamientos = async (req, res) => {
  try{
    const tratamientos = await Tratamiento.find().exec();

    if (tratamientos.length === 0){
      return res
        .status(404)
        .send({message: "No se han encontrado tratamientos"});
    }

    return res.status(200).send(tratamientos);
  } catch (error){
    return res.status(400).send({message: "No se realizó la búsqueda"});
  }
};

const updateTratamiento = async (req, res) => {
  try{
    const{id} = req.params;
    const{nombre, costo, descripcion, duracion} = req.body;
    await validarActualizacionDatos(nombre, costo, descripcion, duracion);
    const tratamiento = await Tratamiento.findByIdAndUpdate(id, req.body, {new: true});
    
    if(!tratamiento){
      return res.status(404).send({message: "No se encontró el tratamiento"})
    }

    return res.status(201).send(tratamiento);
  } catch(error){
    return res.status(400).send({message: error.message});
  }
};

const deleteTratamiento = async (req, res) => {
  try {
    const { id } = req.params;
    const tratamiento = await Tratamiento.findByIdAndDelete(id);

    if (!tratamiento) {
      return res.status(404).send({ message: "No se encontró el tratamiento" });
    }

    return res.status(200).send({ message: "Tratamiento eliminado" });
  } catch (error) {
    return res.status(400).send({ message: "No se eliminó el tratamiento" });
  }
};

const buscarPorNombreTratamiento = async (req, res) => {
  const nombre = req.params.nombre;
  try {
    const tratamiento = await Tratamiento.findOne({ nombreClinica: nombre }).exec();
    if (!tratamiento) {
      return res
        .status(404)
        .send({ message: "No se han encontrado al paciente" });
    }
    return res.status(201).send(paciente);
  } catch (error) {
    return res.status(400).send({ message: "No se realizo la busqueda" });
  }
};

module.exports = {
  createTratamiento,
  getTratamientos,
  updateTratamiento,
  deleteTratamiento,
  buscarPorNombreTratamiento,
};
