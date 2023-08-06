const express = require("express");
const profesionalController = require("../controllers/profesionalController");
const api = express.Router();

api.post("/profesional", profesionalController.createProfesional);
api.get("/profesionales", profesionalController.getProfesionales );



module.exports = api;
