const express = require("express");
const profesionalController = require("../controllers/profesionalController");
const api = express.Router();


api.post("/profesional", profesionalController.createProfesional);
api.get("/profesionales", profesionalController.getProfesionales );
api.put("/profesional/:id", profesionalController.updateProfesional);
api.delete("/profesionalElim/:id",profesionalController.deleteProfesional);
//api.put("/profesional/:id",(id)=>{"hola mundo"+ id})

module.exports = api;
