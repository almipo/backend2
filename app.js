const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000; 

// Middleware
app.use(express.json());
app.use(cookieParser());

// Passport initialization
app.use(passport.initialize());

// Rutas
app.use('/api/auth', authRoutes); 

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mi_base_de_datos')
   .then(() => console.log("Conectado a MongoDB"))
   .catch((error) => console.error("Error al conectar a MongoDB:", error));

// Iniciar el servidor
app.listen(PORT, () => {
   console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
