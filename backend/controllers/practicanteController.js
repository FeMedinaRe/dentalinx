const Practicante = require("../models/practicante");
const Carrera = require("../models/carrera");
const Universidad = require("../models/universidad");
const { format, eachDayOfInterval } = require("date-fns");
const Asociada = require("../models/asociada");

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

const getUniversidad = async (req, res) => {
  try {
    var [idcarrera] = rec.params;
    const universidad = await Universidad.find({_id:{$in:Asociada.distinct("iduniversidad", {idcarrera:idcarrera})}})
   
    if (universidad.length === 0) {
      return res
        .status(404)
        .send({ message: "No se han encontrado Universidades registradas" });
    }

    return res.status(200).send(universidad);
  } catch (error) {
    return res.status(400).send({ message: "No se realizó la búsqueda" });
  }
};

const getCarrera = async (req, res) => {
  console.log("console");
  try {
    console.log(await carrera.find().exec());
    // if (carrera.length === 0) {
    //   return res
    //     .status(404)
    //     .send({ message: "No se han encontrado carreras registradas" });
    // }

    return res.status(200).send(null);
  } catch (error) {
    return res.status(400).send({ message: "No se realizó la búsqueda" });
  }
};

const createPracticante = async (req, res) => {
  try {
    const { rut, nombre, correo, carrera, universidad } = req.body;

    // await validarDatosPaciente(
    //   rut,
    //   nombre,
    //   correo,
    //   carrera,
    //   universidad
    // );

    const newPracticante = new Practicante({
      rut,
      nombre,
      correo,
      carrera,
      universidad
    });

    const Practicante = await newPracticante.save();

    return res.status(201).send(Practicante);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const getPracticante = async (req, res) => {
  try {
    const practicante = await Practicante.find().exec();

    if (practicante.length === 0) {
      return res
        .status(404)
        .send({ message: "No se han encontrado practicantes registrados" });
    }

    return res.status(200).send(practicante);
  } catch (error) {
    return res.status(400).send({ message: "No se realizó la búsqueda" });
  }
};

const updatePracticante = async (req, res) => {
  try {
    const { id } = req.params;

    const { rut, nombre, correo, carrera, universidad } = req.body;

    await validarActualizacionDatos(rut, nombre, correo, carrera, universidad);

    const practicante = await Paciente.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!practicante) {
      return res.status(404).send({ message: "No se encontró el practicante" });
    }

    return res.status(201).send(practicante);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const deletePracticante = async (req, res) => {
  try {
    const { id } = req.params;
    const practicante = await Practicante.findByIdAndDelete(id);

    if (!practicante) {
      return res.status(404).send({ message: "No se encontró el practicante" });
    }

    return res.status(200).send({ message: "Practicante eliminado" });
  } catch (error) {
    return res.status(400).send({ message: "No se elimino al practicante" });
  }
};


module.exports = {
  createPracticante,
  getPracticante,
  getCarrera,
  getUniversidad,
  updatePracticante,
  deletePracticante,
};
