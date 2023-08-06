const express = require("express");
const clinicaController = require("../controllers/clinicaController");
const api = express.Router();

api.post("/clinica", clinicaController.createClinica);
api.get("/clinicas", clinicaController.getClinicas);
api.put("/clinica/:id", clinicaController.updateClinica);
api.delete("/Clinica/:id", clinicaController.deleteClinica);
api.get("/clinicaPorRut/:rut", clinicaController.buscarPorRutClinica);
api.get("/clinicaPorNombre/:nombre", clinicaController.buscarPorNombreClinica);

module.exports = api;
