const express = require("express");
const pacienteController = require("../controllers/pacienteController");
const api = express.Router();

api.post("/paciente", pacienteController.createPaciente);
api.get("/pacientes", pacienteController.getPacientes);
api.put("/paciente/:id", pacienteController.updatePaciente);
api.delete("/deletePaciente/:id", pacienteController.deletePaciente);
api.get("/pacientePorRut/:rut", pacienteController.buscarPorRut);
api.get("/pacientePorNombre/:nombre", pacienteController.buscarPorNombre);

module.exports = api;
