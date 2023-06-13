const Paciente = require('../models/paciente');

async function validarDatosPaciente(rut, nombre, direccion, edad, saldo) {

  if (rut.length < 8 || rut.length > 12) {
    throw new Error("El rut es incorrecto");
  }

  const regexRut = /^[\d.kK-]+$/;
  if (!regexRut.test(rut)) {
    throw new Error("El rut no puede contener letras");
  }

  const rutRegistrado = await Paciente.findOne({ rut: rut })
  if (rutRegistrado) {
    throw new Error("El rut ya fue ingresado");
  }

  const regex = /^[A-Za-z\s]+$/;

  if (!regex.test(nombre)) {
    throw new Error("El nombre debe contener solo letras");
  }

  if (nombre.length < 8) {
    throw new Error("El nombre no contiene los suficientes caracteres");
  }

  if (edad < 0 || edad > 150) {
    throw new Error("La edad es incorrecta");
  }

  if (saldo < 0) {
    throw new Error("El saldo es incorrecto");
  }

}

async function validarActualizacionDatos(nombre,edad,saldo){

  const regex = /^[A-Za-z\s]+$/;

  if (!regex.test(nombre)) {
    throw new Error("El nombre debe contener solo letras");
  }

  if (nombre.length < 8) {
    throw new Error("El nombre no contiene los suficientes caracteres");
  }

  if (edad < 0 || edad > 150) {
    throw new Error("La edad es incorrecta");
  }

  if (saldo < 0) {
    throw new Error("El saldo es incorrecto");
  }

}

const createPaciente = async (req, res) => {
    try {
      const { rut, nombre, direccion, edad, saldo } = req.body;

      await validarDatosPaciente(rut,nombre,direccion,edad,saldo)

      const newPaciente = new Paciente({
        rut,
        nombre,
        direccion,
        edad,
        saldo
      });

      const paciente = await newPaciente.save();

      return res.status(201).send(paciente);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }

  };

//modificar
const getPaciente = (req,res) => {

    const {idPaciente} = req.body
    Paciente.findById(idPaciente, (error,paciente) => {

        if(error) {
            return res.starus(400).send({ message: "No se encontro al paciente" })
        }

        if(!paciente){
            return res.status(404).send({ message: "No hay pacientes registrados" })
        }
    })
}


const getPacientes = async (req, res) => {
    try {
      const pacientes = await Paciente.find().exec();

      if (pacientes.length === 0) {
        return res.status(404).send({ message: "No se han encontrado pacientes registrados" });
      }

      return res.status(200).send(pacientes);
    } catch (error) {
      return res.status(400).send({ message: "No se realizó la búsqueda" });
    }
  };


  const updatePaciente = async (req, res) => {

    try {
      const { id } = req.params;

      const { nombre, direccion, edad, saldo } = req.body;

      await validarActualizacionDatos(nombre,edad,saldo)

      const paciente = await Paciente.findByIdAndUpdate(id, req.body, { new: true });

      if (!paciente) {
        return res.status(404).send({ message: "No se encontró el paciente" });
      }

      return res.status(201).send(paciente);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  };

  const deletePaciente = async (req, res) => {

    try{
      const { id } = req.params
      const paciente = await Paciente.findByIdAndDelete(id);

      if (!paciente) {
        return res.status(404).send({ message: "No se encontró el paciente" });
      }

      return res.status(200).send({ message: "Paciente eliminado" });
    } catch (error) {
      return res.status(400).send({ message: "No se elimino al paciente" });
    }
  };


module.exports = {
    createPaciente,
    getPaciente,
    getPacientes,
    updatePaciente,
    deletePaciente
}