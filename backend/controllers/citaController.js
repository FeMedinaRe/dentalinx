const cita = require("../models/cita");
const paciente = require("../models/paciente");
const dentista = require("../models/dentista");
const tratamiento = require("../models/tratamiento");

async function validarDatoscita(
    rut,
    nombre,
    direccion,
    edad,
    saldo,
    correo
) {
    if (rut.length < 8 || rut.length > 12) {
        throw new Error("El rut es incorrecto");
    }

    const regexRut = /^[\d.kK-]+$/;
    if (!regexRut.test(rut)) {
        throw new Error("El rut no puede contener letras");
    }

    const rutRegistrado = await cita.findOne({ rut: rut });
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

    if (edad < 0 || edad > 150) {
        throw new Error("La edad es incorrecta");
    }

    if (saldo < 0) {
        throw new Error("El saldo es incorrecto");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(correo)) {
        throw new Error("El formato del correo es incorrecto");
    }
}

async function validarActualizacionDatos(edad, saldo, direccion) {
    if (edad < 0 || edad > 150) {
        throw new Error("La edad es incorrecta");
    }

    if (saldo < 0) {
        throw new Error("El saldo es incorrecto");
    }
    if (direccion.length < 8) {
        throw new Error("La direccion no contiene los suficientes caracteres");
    }
}

const createCita = async(req, res) => {
    try {
        console.log("Hola");
        var { paciente_id, dentista_id, tratamiento_id, fecha, hora, estado } = req.body;
    
        // var _categoria = categoria;
        // var _nombre = nombre;
        // var _cantidad = parseInt(cantidad);
        var _id_paciente = paciente_id;
        var _id_dentista = dentista_id;
        var _id_tratamiento = tratamiento_id;

        // console.log("_id_paciente:", _id_paciente);
    

        //PACIENTE
        paciente_id = await paciente.findOne({nombre: _id_paciente}, {_id: 1})
        // console.log("AYUDA");
        paciente_id = paciente_id._id;
        // console.log("ALOHA");
        console.log(paciente_id);

        //DENTISTA
        dentista_id = await dentista.findOne({nombre: _id_dentista}, {_id: 1})
        console.log("DENTISTA");
        dentista_id = dentista_id._id;
        console.log(dentista_id);

        //TRATAMIENTO
        tratamiento_id = await tratamiento.findOne({nombre: _id_tratamiento}, {_id: 1})
        console.log("TRATAMIENTO");
        tratamiento_id = tratamiento_id._id;
        console.log(tratamiento_id);
        
        console.log(paciente_id);
        console.log(dentista_id);
        console.log(tratamiento_id);
        console.log(typeof fecha);
        console.log(typeof hora);
        console.log(typeof estado);


        citaNueva = new cita({
            paciente_id,
            dentista_id,
            tratamiento_id,
            fecha,
            hora,
            estado,
        })

        citaNueva = citaNueva.save();


        return res.status(201).send(citaNueva);
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
};

//Para mostrar las citas en la tabla
const getCitas = async(req, res) => {
    try {
        const citas = await cita.aggregate([{
                $lookup: {
                    from: "pacientes",
                    localField: "paciente_id",
                    foreignField: "_id",
                    as: "paciente_info"
                }
            },
            {
                $lookup: {
                    from: "dentistas",
                    localField: "dentista_id",
                    foreignField: "_id",
                    as: "dentista_info"
                }
            },
            {
                $lookup: {
                    from: "tratamientos",
                    localField: "tratamiento_id",
                    foreignField: "_id",
                    as: "tratamiento_info"
                }
            },
            {
                $unwind: "$paciente_info"
            },
            {
                $unwind: "$dentista_info"
            },
            {
                $unwind: "$tratamiento_info"
            },
            {
                $project: {
                    _id: 1,
                    paciente_id: "$paciente_info.nombre",
                    dentista_id: "$dentista_info.nombre",
                    tratamiento_id: "$tratamiento_info.nombre",
                    fecha: 1,
                    hora: 1,
                    estado: 1,

                }
            }
        ]);;


        if (citas.length === 0) {
            return res
                .status(404)
                .send({ message: "No se han encontrado citas agendadas" });
        }

        return res.status(200).send(citas);
    } catch (error) {
        return res.status(400).send({ message: "No se realizó la búsqueda" });
    }
};

const updatecita = async(req, res) => {
    try {
        const { id } = req.params;

        const { direccion, edad, saldo } = req.body;

        await validarActualizacionDatos(edad, saldo, direccion);

        const cita = await cita.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        if (!cita) {
            return res.status(404).send({ message: "No se encontró el cita" });
        }

        return res.status(201).send(cita);
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
};

//Para eliminar una cita
const deleteCita = async(req, res) => {
    try {
        const { id } = req.params;
        const citas = await cita.findByIdAndDelete(id);

        if (!citas) {
            return res.status(404).send({ message: "No se encontró la cita" });
        }

        return res.status(200).send({ message: "cita eliminada" });
    } catch (error) {
        return res.status(400).send({ message: "No se elimino la cita" });
    }
};

const buscarPorRut = async(req, res) => {
    const rut = req.params.rut;
    try {
        const cita = await cita.findOne({ rut: rut }).exec();
        if (!cita) {
            return res
                .status(404)
                .send({ message: "No se han encontrado al cita" });
        }
        return res.status(201).send(cita);
    } catch (error) {
        return res.status(400).send({ message: "No se realizo la busqueda" });
    }
};

const buscarPorNombre = async(req, res) => {
    const nombre = req.params.nombre;
    try {
        const cita = await cita.findOne({ nombre: nombre }).exec();
        if (!cita) {
            return res
                .status(404)
                .send({ message: "No se han encontrado al cita" });
        }
        return res.status(201).send(cita);
    } catch (error) {
        return res.status(400).send({ message: "No se realizo la busqueda" });
    }
};

module.exports = {
    createCita,
    getCitas,
    // updatecita,
    deleteCita,
    // buscarPorRut,
    // buscarPorNombre,
};