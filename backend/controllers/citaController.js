const Cita = require("../models/cita");
const paciente = require("../models/paciente");
const dentista = require("../models/dentista");
const tratamiento = require("../models/tratamiento");

//Para crear una nueva cita
const createCita = async(req, res) => {
    try {
        console.log("Hola");
        var { paciente_id, dentista_id, tratamiento_id, fecha, hora, estado } = req.body;

        var _id_paciente = paciente_id;
        var _id_dentista = dentista_id;
        var _id_tratamiento = tratamiento_id;

        //PACIENTE
        paciente_id = await paciente.findOne({ nombre: _id_paciente }, { _id: 1 })
            // console.log("AYUDA");
        paciente_id = paciente_id._id;
        // console.log("ALOHA");
        console.log(paciente_id);

        //DENTISTA
        dentista_id = await dentista.findOne({ nombre: _id_dentista }, { _id: 1 })
        console.log("DENTISTA");
        dentista_id = dentista_id._id;
        console.log(dentista_id);

        //TRATAMIENTO
        tratamiento_id = await tratamiento.findOne({ nombre: _id_tratamiento }, { _id: 1 })
        console.log("TRATAMIENTO");
        tratamiento_id = tratamiento_id._id;
        console.log(tratamiento_id);

        // console.log(paciente_id);
        // console.log(dentista_id);
        // console.log(tratamiento_id);
        // console.log(typeof fecha);
        // console.log(typeof hora);
        // console.log(typeof estado);


        citaNueva = new Cita({
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

//Para obtener los dentistas para el select
const getDentistas = async(req, res) => {
    try {
        const dentistas = await dentista.find();

        if (dentistas.length === 0) {
            return res
                .status(404)
                .send({ message: "No se han encontrado dentistas" });
        }
        return res.status(200).send(dentistas);
    } catch (error) {
        return res.status(400).send({ message: "No se realizó la búsqueda" });
    }
}

//Para obtener los pacientes para el select
const getPacientes = async(req, res) => {
    try {
        const pacientes = await paciente.find();

        if (pacientes.length === 0) {
            return res
                .status(404)
                .send({ message: "No se han encontrado pacientes" });
        }
        return res.status(200).send(pacientes);
    } catch (error) {
        return res.status(400).send({ message: "No se realizó la búsqueda" });
    }
}

//Para obtener los dentistas para el select
const getTratamientos = async(req, res) => {
    try {
        const tratamientos = await tratamiento.find();

        if (tratamientos.length === 0) {
            return res
                .status(404)
                .send({ message: "No se han encontrado tratamientos" });
        }
        return res.status(200).send(tratamientos);
    } catch (error) {
        return res.status(400).send({ message: "No se realizó la búsqueda" });
    }
}

//Para mostrar las citas en la tabla
const getCitas = async(req, res) => {
    try {
        const citas = await Cita.aggregate([{
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

const updateCita = async(req, res) => {
    try {

        console.log("PRUEBA UPDATE");
        var { id } = req.params;

        var { paciente_id, dentista_id, tratamiento_id, fecha, hora, estado } = req.body;

        var _id_paciente = paciente_id;
        var _id_dentista = dentista_id;
        var _id_tratamiento = tratamiento_id;

        //PACIENTE
        paciente_id = await paciente.findOne({ nombre: _id_paciente }, { _id: 1 })
        paciente_id = paciente_id._id;

        //DENTISTA
        dentista_id = await dentista.findOne({ nombre: _id_dentista }, { _id: 1 })
        dentista_id = dentista_id._id;

        //TRATAMIENTO
        tratamiento_id = await tratamiento.findOne({ nombre: _id_tratamiento }, { _id: 1 })
        tratamiento_id = tratamiento_id._id;

        console.log("Este es el id que llega");
        console.log(id);

        console.log("Lo transformamos a ObjectId")
        const { ObjectId } = require("mongodb");

        // id = new ObjectId(id)
        // console.log(typeof id);
        // console.log(id);

        var query = await Cita.findByIdAndUpdate (id, {
            paciente_id: paciente_id,
            dentista_id: dentista_id,
            tratamiento_id: tratamiento_id,
            fecha: fecha,
            hora: hora,
            estado: estado,
        }, {
            new: true,
        });

        console.log(query);

        if (!query) {
            return res.status(404).send({ message: "No se encontró la cita" });
        }

        return res.status(201).send(query);
    }  catch (error) {
        console.log("Ocurrió un error:", error.message);
        return res.status(400).send({ message: error.message });
    }
};

//Para eliminar una cita
const deleteCita = async(req, res) => {
    try {
        const { id } = req.params;
        const citas = await Cita.findByIdAndDelete(id);

        if (!citas) {
            return res.status(404).send({ message: "No se encontró la cita" });
        }

        return res.status(200).send({ message: "cita eliminada" });
    } catch (error) {
        return res.status(400).send({ message: "No se elimino la cita" });
    }
};

module.exports = {
    createCita,
    getCitas,
    updateCita,
    deleteCita,
    getDentistas,
    getPacientes,
    getTratamientos,
};