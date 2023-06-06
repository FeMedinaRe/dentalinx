const express = require('express');
const pacienteController = require('../controllers/pacienteController');
const api = express.Router();

api.post('/paciente', pacienteController.createPaciente);
api.get('/getPaciente/:id', pacienteController.getPaciente)
api.get('/pacientes', pacienteController.getPacientes)

module.exports = api;

