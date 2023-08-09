const Practicante = require("../models/practicante");
const Carrera = require("../models/carrera");
const Universidad = require("../models/universidad");
const { format, eachDayOfInterval } = require("date-fns");
const Asociada = require("../models/asociada");

async function validarDatosPracticante(
  rut,
  nombre,
  correo,
  idcarrera,
  iduniversidad
) {
  if (rut.length < 12 || rut.length > 12) {
    throw new Error("El rut es incorrecto");
  }

  const regexRut = /^[\d.kK-]+$/;
  if (!regexRut.test(rut)) {
    throw new Error("Formato incorrecto del rut");
  }

  const rutRegistrado = await Practicante.findOne({ rut: rut });
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

  const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!correoRegex.test(correo)) {
    throw new Error("Formato de correo incorrecto");
  }


}

async function validarActualizacionDatos(
  rut,
  nombre,
  correo,
  idcarrera,
  iduniversidad
) {
  if (rut.length < 12 || rut.length > 12) {
    throw new Error("El rut es incorrecto");
  }
  const regexRut = /^[\d.kK-]+$/;
  if (!regexRut.test(rut)) {
    throw new Error("Formato incorrecto del rut");
  }

  const regex = /^[A-Za-z\s]+$/;

  if (!regex.test(nombre)) {
    throw new Error("El nombre debe contener solo letras");
  }

  if (nombre.length < 8) {
    throw new Error("El nombre no contiene los suficientes caracteres");
  }
  const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!correoRegex.test(correo)) {
    throw new Error("Formato de correo incorrecto");
  }

}

const getUniversidad = async (req, res) => {
  try {

    const universidad = await Universidad.find();
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
  //console.log("console");
  try {
    const carrera = await Carrera.find().exec()
    //console.log(carrera);
     if (carrera.length === 0) {
       return res
         .status(404)
         .send({ message: "No se han encontrado carreras registradas" });
     }

    return res.status(200).send(carrera);
  } catch (error) {
    return res.status(400).send({ message: "No se realizó la búsqueda" });
  }
};

const createPracticante = async (req, res) => {
  
  try {
    const { rut, nombre, correo, carrera, universidad } = req.body;

    console.log(rut, nombre, correo, carrera, universidad)
    const { ObjectId } = require("mongodb");   
    var idcarrera = new ObjectId(carrera);
    var iduniversidad = new ObjectId(universidad);
    console.log(typeof idcarrera,typeof iduniversidad);
    
    await validarDatosPracticante(
      rut,
      nombre,
      correo,
      carrera,
      universidad
    );
    // transformar un String a ObjectId
    //const { ObjectId } = require("mongodb");
    
    // console.log(typeof idcarrera,typeof iduniversidad);
    const newPracticante = new Practicante({
      rut,
      nombre,
      correo,
      idcarrera,
      iduniversidad
    });
    //console.log(newPracticante);
    const practicante = await newPracticante.save();

    return res.status(201).send(practicante);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.message });
  }
};

const getPracticante = async (req, res) => {
  try {
    const practicantes = await Practicante.aggregate([{
      $lookup: {
          from: "universidades",
          localField: "iduniversidad",
          foreignField: "_id",
          as: "universidad_info"
      }
  },
  {
      $lookup: {
          from: "carreras",
          localField: "idcarrera",
          foreignField: "_id",
          as: "carrera_info"
      }
  },
  {
      $unwind: "$universidad_info"
  },
  {
      $unwind: "$carrera_info"
  },
  {
      $project: {
          _id: 1,
          rut: 1,
          nombre: 1,
          correo: 1,
          idcarrera: "$carrera_info.nombre",
          iduniversidad: "$universidad_info.nombre",

      }
  }
]);;

console.log(practicantes);

    if (practicantes.length === 0) {
      return res
        .status(404)
        .send({ message: "No se han encontrado practicantes registrados" });
    }

    return res.status(200).send(practicantes);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "No se realizó la búsqueda" });
  }
};

const updatePracticante = async (req, res) => {
  console.log(req.params, req.body);
  try {
    var { id } = req.params;

    var { rut, nombre, correo, idcarrera, iduniversidad } = req.body;

    var _carrera = idcarrera;
    var _universidad = iduniversidad;

    await validarActualizacionDatos( rut, nombre, correo, idcarrera, iduniversidad );

    //carrera
    idcarrera = await Carrera.findOne({ nombre: _carrera }, { _id: 1 })
    idcarrera = idcarrera._id;

    //universidad
    iduniversidad = await Universidad.findOne({ nombre: _universidad }, { _id: 1 })
    iduniversidad = iduniversidad._id;

    var practicantes = await Practicante.findByIdAndUpdate (id, {
      rut : rut,
      nombre : nombre,
      correo : correo,
      idcarrera : idcarrera,
      iduniversidad : iduniversidad
  }, {
      new: true,
  });
    if (!practicantes) {
      return res.status(404).send({ message: "No se encontró el practicante" });
    }

    return res.status(201).send(practicantes);
  } catch (error) {
    console.log(error);
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
