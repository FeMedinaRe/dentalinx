const Clinica = require("../models/clinica");

async function validarDatosClinica(
  rutClinica,
  nombreClinica,
  telefono,
  direccionClinica,
  correoClinica,
  rutDueno,
) {
  if (rutClinica.length < 8 || rutClinica.length > 12) {
    throw new Error("El rut es incorrecto");
  }

  const regexRut = /^[\d.kK-]+$/;
  if (!regexRut.test(rutClinica)) {
    throw new Error("El rut no puede contener letras");
  }
  if (!regexRut.test(rutDueno)) {
    throw new Error("El rut no puede contener letras");
  }

  const rutRegistrado = await Clinica.findOne({ rutClinica: rutClinica });
  if (rutRegistrado) {
    throw new Error("El rut ya fue ingresado");
  }

  const regex = /^[A-Za-z\s]+$/;

  if (!regex.test(nombreClinica)) {
    throw new Error("El nombre debe contener solo letras");
  }

  if (nombreClinica.length < 8) {
    throw new Error("El nombre no contiene los suficientes caracteres");
  }

  if (direccionClinica.length < 8) {
    throw new Error("La direccion no contiene los suficientes caracteres");
  }
  if(telefono < 8){
    throw new Error("El telefono no cuenta con suficientes caracteres");
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(correoClinica)) {
    throw new Error("El formato del correo es incorrecto");
  }
}

async function validarActualizacionDatos(direccionClinica) {
  

  if (direccionClinica.length < 8) {
    console.log("error direccion");
    throw new Error("La direccion no contiene los suficientes caracteres");
  }
}

const createClinica = async (req, res) => {
  try {
    const { rutClinica, nombreClinica, telefono, direccionClinica, correoClinica, rutDueno } = req.body;

    await validarDatosClinica(rutClinica, nombreClinica, telefono, direccionClinica, correoClinica, rutDueno);

    const newClinica = new Clinica({
      rutClinica,
      telefono,
      nombreClinica,
      direccionClinica,
      correoClinica,
      rutDueno,
    });

    const clinica = await newClinica.save();

    return res.status(201).send(clinica);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const getClinicas = async (req, res) => {
  try {
    const clinicas = await Clinica.find().exec();

    if (clinicas.length === 0) {
      return res
        .status(404)
        .send({ message: "No se han encontrado clinicas registradas" });
    }

    return res.status(200).send(clinicas);
  } catch (error) {
    return res.status(400).send({ message: "No se realizó la búsqueda" });
  }
};

const updateClinica = async (req, res) => {
  try {
    const { id } = req.params;

    const { direccionClinica, correoClinica, rutDueno, telefono } = req.body;

    await validarActualizacionDatos(direccionClinica, correoClinica, rutDueno, telefono);

    const clinica = await Clinica.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!clinica) {
      return res.status(404).send({ message: "No se encontró la clinica" });
    }

    return res.status(201).send(clinica);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const deleteClinica = async (req, res) => {
  try {
    const { id } = req.params;
    const clinica = await Clinica.findByIdAndDelete(id);

    if (!clinica) {
      return res.status(404).send({ message: "No se encontró la clinica" });
    }

    return res.status(200).send({ message: "Clinica eliminada" });
  } catch (error) {
    return res.status(400).send({ message: "No se elimino la clinica" });
  }
};

const buscarPorRutClinica = async (req, res) => {
  const rut = req.params.rut;
  try {
    const clinica = await Clinica.findOne({ rutClinica: rut }).exec();
    if (!clinica) {
      return res
        .status(404)
        .send({ message: "No se han encontrado al clinica" });
    }
    return res.status(201).send(clinica);
  } catch (error) {
    return res.status(400).send({ message: "No se realizo la busqueda" });
  }
};

const buscarPorNombreClinica = async (req, res) => {
  const nombre = req.params.nombre;
  try {
    const clinica = await Clinica.findOne({ nombreClinica: nombre }).exec();
    if (!clinica) {
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
  createClinica,
  getClinicas,
  updateClinica,
  deleteClinica,
  buscarPorRutClinica,
  buscarPorNombreClinica,
};
