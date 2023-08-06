const tratamientos = require("../models/tratamientos");

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

const createTratamiento = async (req, res) => {
    try {
      const { nombre, costo, descripcion, duracion } = req.body;
  
      await validarDatosTratamientos(
        nombre,
        costo,
        descripcion,
        duracion
      );
  
      const edad = calcularEdad(fechaNacimiento);
  
      const fechaIngreso = format(new Date(), "dd/MM/yyyy");
  
      const newPaciente = new Paciente({
        rut,
        nombre,
        direccion,
        edad,
        correo,
        fechaNacimiento,
        sexo,
        fechaIngreso,
      });
  
      const paciente = await newPaciente.save();
  
      return res.status(201).send(paciente);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  };