const Paciente = require('../models/paciente');

const createPaciente = async (req, res) => {
    try {
      const { rut, nombre, direccion, edad, saldo } = req.body;

      const regex = /^[A-Za-z\s]+$/;

      if (!regex.test(nombre)) {
      return res.status(400).send({ message: "El nombre debe contener solo letras" });
      }

      if (nombre.length < 8 ){
      return res.status(400).send({ message: "El nombre no contiene los suficientes caracteres" });
      }

      if (edad<0 || edad > 150){
      return res.status(400).send({ message: "La edad es incorrecta" });
      }

      if (saldo < 0){
      return res.status(400).send({ message: "El saldo es incorrecto" });
      }

      const regexRut = /^[\d.kK-]+$/;
      if (!regexRut.test(rut)) {
      return res.status(400).send({ message: "El rut no puede contener letras" });
      }

      if (rut.length < 8 || rut.length > 12){
        return res.status(400).send({ message: "El rut es incorrecto" });
      }

      if (direccion.length < 8){
        return res.status(400).send({ message: "La direccion no contiene los suficientes caracteres" });
      }

      if (await Paciente.exists({ rut: rut })) {
        return res.status(400).send({ message: "El rut ya fue ingresado" });
      }

      const newPaciente = new Paciente({
        rut:rut,
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
      const paciente = await Paciente.findByIdAndUpdate(id, req.body, { new: true });

      if (!paciente) {
        return res.status(404).send({ message: "No se encontró el paciente" });
      }

      return res.status(200).send(paciente);
    } catch (error) {
      return res.status(400).send({ message: "No se actualizaron los datos del paciente" });
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