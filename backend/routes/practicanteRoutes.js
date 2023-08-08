const express = require("express");
const practicanteController = require("../controllers/practicanteController");
const api = express.Router();

api.post("/practicante", practicanteController.createPracticante);
api.get("/practicante", practicanteController.getPracticante);
api.put("/practicante/:id", practicanteController.updatePracticante);
api.delete("/deletepracticante/:id", practicanteController.deletePracticante);
api.get("/universidad", practicanteController.getUniversidad);
api.get("/carrera", practicanteController.getCarrera);

module.exports = api;
