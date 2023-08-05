const Paciente = require("../models/paciente");
const { format, eachDayOfInterval } = require("date-fns");

async function validarDatosPaciente(
  rut,
  nombre,
  direccion,
  correo,
  sexo,
  fechaNacimiento
) {
  if (rut.length < 8 || rut.length > 12) {
    throw new Error("El rut es incorrecto");
  }

  const regexRut = /^[\d.kK-]+$/;
  if (!regexRut.test(rut)) {
    throw new Error("Formato incorrecto del rut");
  }

  const rutRegistrado = await Paciente.findOne({ rut: rut });
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

  if (direccion.length < 8) {
    throw new Error("La direccion no contiene los suficientes caracteres");
  }

  const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!correoRegex.test(correo)) {
    throw new Error("Formato de correo incorrecto");
  }

  if (sexo.length == 0) {
    throw new Error("Debe marcar el sexo");
  }

  if (fechaNacimiento == 0) {
    throw new Error("Debe ingresa una fecha de nacimiento");
  }
}

async function validarActualizacionDatos(
  direccion,
  edad,
  correo,
  fechaIngreso
) {
  if (edad < 0 || edad > 150) {
    console.log("error edad");
    throw new Error("La edad es incorrecta");
  }

  if (direccion.length < 8) {
    console.log("error direccion");
    throw new Error("La direccion no contiene los suficientes caracteres");
  }

  const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!correoRegex.test(correo)) {
    throw new Error("Formato de correo incorrecto");
  }

  if (fechaIngreso == null) {
    throw new Error("Fecha Incorrecta");
  }
}

const createPaciente = async (req, res) => {
  try {
    const { rut, nombre, direccion, correo, fechaNacimiento, sexo } = req.body;

    await validarDatosPaciente(
      rut,
      nombre,
      direccion,
      correo,
      sexo,
      fechaNacimiento
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

const getPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.find().exec();

    if (pacientes.length === 0) {
      return res
        .status(404)
        .send({ message: "No se han encontrado pacientes registrados" });
    }

    return res.status(200).send(pacientes);
  } catch (error) {
    return res.status(400).send({ message: "No se realizó la búsqueda" });
  }
};

const updatePaciente = async (req, res) => {
  try {
    const { id } = req.params;

    const { direccion, edad, correo, fechaIngreso } = req.body;

    await validarActualizacionDatos(direccion, edad, correo, fechaIngreso);

    const paciente = await Paciente.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!paciente) {
      return res.status(404).send({ message: "No se encontró el paciente" });
    }

    return res.status(201).send(paciente);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const deletePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const paciente = await Paciente.findByIdAndDelete(id);

    if (!paciente) {
      return res.status(404).send({ message: "No se encontró el paciente" });
    }

    return res.status(200).send({ message: "Paciente eliminado" });
  } catch (error) {
    return res.status(400).send({ message: "No se elimino al paciente" });
  }
};

function calcularEdad(dateString) {
  const birthdateObj = new Date(dateString);
  const currentDate = new Date();

  const yearsDiff = currentDate.getFullYear() - birthdateObj.getFullYear();
  const monthsDiff = currentDate.getMonth() - birthdateObj.getMonth();
  const daysDiff = currentDate.getDate() - birthdateObj.getDate();

  let edad = yearsDiff;

  if (monthsDiff < 0 || (monthsDiff === 0 && daysDiff < 0)) {
    edad--;
  }

  return edad;
}

module.exports = {
  createPaciente,
  getPacientes,
  updatePaciente,
  deletePaciente,
};
