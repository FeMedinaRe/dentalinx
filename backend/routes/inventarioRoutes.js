const express = require("express");
const inventarioController = require("../controllers/inventarioController");
const api = express.Router();

api.post("/inventario", inventarioController.createInventario);
api.get("/inventario", inventarioController.getInventarios);
api.put("/inventario/:id", inventarioController.updateInventario);
api.delete("/inventario/:id", inventarioController.deleteInventario);
api.get("/inventarioPorRut/:rut", inventarioController.buscarPorRut);
api.get("/inventarioPorNombre/:nombre", inventarioController.buscarPorNombre);
// prueba
api.put("/inventarioQuitar/:action", inventarioController.update);

module.exports = api;
