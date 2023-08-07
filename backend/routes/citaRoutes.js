const express = require("express");
const citaController = require("../controllers/citaController");
const api = express.Router();

api.post("/cita", citaController.createCita);
api.get("/citas", citaController.getCitas);
api.put("/cita/:id", citaController.updateCita);
api.delete("/deleteCita/:id", citaController.deleteCita);
// api.get("/citaPorRut/:rut", citaController.buscarPorRut);
// api.get("/citaPorNombre/:nombre", citaController.buscarPorNombre);


module.exports = api;