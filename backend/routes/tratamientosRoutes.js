const express = require("express");
const tratamientoController = require("../controllers/tratamientosController");
const api = express.Router();

api.post("/tratamiento", tratamientoController.createTratamiento);
api.get("/tratamientos", tratamientoController.getTratamientos);
api.put("/tratamiento/:id", tratamientoController.updateTratamiento);
api.delete("/Tratamiento/:id", tratamientoController.deleteTratamiento);
api.get("/tratamientoPorRut/:rut", tratamientoController.buscarPorNombreTratamiento);

module.exports = api;
