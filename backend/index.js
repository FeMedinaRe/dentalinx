const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

const pacienteRoutes = require('./routes/pacienteRoutes');
<<<<<<< HEAD
const practicanteRoutes = require('./routes/practicanteRoutes');
=======
const profesionalRoutes= require('./routes/profesionalRoutes');

>>>>>>> 42a0779019e5ed45eaba73afead6b185520d0268
const inventarioRoutes = require('./routes/inventarioRoutes');
const citaRoutes = require('./routes/citaRoutes');

app.use(cors());
app.use(express.json());
app.options('', cors());

app.use('/api', pacienteRoutes);
app.use('/api', profesionalRoutes);
app.use('/api', inventarioRoutes);
app.use('/api', citaRoutes);
app.use('/api', practicanteRoutes);

mongoose.connect('mongodb+srv://Juan:juan1234@dentalinx.sz8at8j.mongodb.net/')
    .then(() => {
        // Lógica después de que la conexión se establezca correctamente
        console.log('Conexión exitosa a la base de datos');
    })
    .catch((error) => {
        // Manejo de errores en caso de que la conexión falle
        console.error('Error al conectar a la base de datos:', error);
    });


app.listen(3001, () => {
    console.log(`Inicia en puerto ${process.env.PORT}`);
})