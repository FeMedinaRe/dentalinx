const Paciente = require('../models/paciente');

const createPaciente = async (req, res) => {
    try {
      const { rut, nombre, direccion, edad, saldo } = req.body;
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
      return res.status(400).send({ message: "No se registró el paciente" });
    }
  };


const getPaciente = (req,res) => {

    console.log('holaaa')

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


module.exports = {
    createPaciente,
    getPaciente,
    getPacientes
}