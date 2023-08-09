const express = require("express");
const citaController = require("../controllers/citaController");
const api = express.Router();

api.post("/cita", citaController.createCita);
api.get("/citas", citaController.getCitas);
api.get("/citaPacientes", citaController.getPacientes);
api.get("/citaDentistas", citaController.getDentistas);
api.get("/citaTratamientos", citaController.getTratamientos);
api.put("/cita/:id", citaController.updateCita);
api.delete("/deleteCita/:id", citaController.deleteCita);
// api.get("/citaPorRut/:rut", citaController.buscarPorRut);
// api.get("/citaPorNombre/:nombre", citaController.buscarPorNombre);

// PARA LOS INFORMES

api.get("/generarinformes", citaController.buscarPorFechas);


module.exports = api;