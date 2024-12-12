// routes/user.routes.js
const express = require('express');
const passport = require('/config/passport'); 
const User = require('../models/user');
const sendEmail = require('../services/mail.service'); 
const UserDTO = require('../dtos/UserDTO'); 


const router = express.Router();

// Ruta para obtener los datos del usuario logueado
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.json(userDTO);  
});

// Ruta para registrar un usuario
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password, role } = req.body;

    try {
        const user = new User({ first_name, last_name, email, age, password, role });
        await user.save();

        // Enviar un correo de bienvenida
        const subject = 'Bienvenido a nuestra aplicación';
        const text = `Hola ${first_name},\n\nGracias por registrarte en nuestra aplicación.`;
        const html = `<p>Hola <strong>${first_name}</strong>,</p><p>Gracias por registrarte en nuestra aplicación.</p>`;

        // Enviar el correo
        await sendEmail(email, subject, text, html);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

module.exports = router;
