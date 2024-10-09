const express = require('express');
const conectarDB = require('./config/db');
const app = express();
const cors = require("cors");

// Conectar a la base de datos
conectarDB();

// Configurar CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Middleware para procesar JSON
app.use(express.json());

// Definir rutas
app.use('/Hasso', require('./routes/rutas'));

// Arrancar el servidor
app.listen(4000, () => {
    console.log('Servidor corriendo en el puerto 4000');
});
