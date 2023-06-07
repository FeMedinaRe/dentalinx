const express = require('express');
const pacienteController = require('../controllers/pacienteController');
const api = express.Router();

api.post('/paciente', pacienteController.createPaciente);
api.get('/getPaciente/:id', pacienteController.getPaciente)
api.get('/pacientes', pacienteController.getPacientes)
api.put('/paciente/:id', pacienteController.updatePaciente)
api.delete('/deletePaciente/:id', pacienteController.deletePaciente)

module.exports = api;

