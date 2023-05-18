const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect('mongodb+srv://Juan:juan1234@dentalinx.sz8at8j.mongodb.net/')
  .then(() => {
    // Lógica después de que la conexión se establezca correctamente
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((error) => {
    // Manejo de errores en caso de que la conexión falle
    console.error('Error al conectar a la base de datos:', error);
  });


app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
})