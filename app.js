const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const connectDB = require('./config/db');
require('dotenv').config();
const sessionRoutes = require('./routes/sessionRoutes');  

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api/users', userRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/sessions', sessionRoutes);
connectDB();

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
   console.log(`Servidor corriendo en puerto ${port}`);
});
//VxOlk5AISmF1SFk2 alanpozzi