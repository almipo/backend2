const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User.js');
const passport = require('passport');

const router = express.Router();
const JWT_SECRET = '1234'; 

// Ruta de registro
router.post('/register', async (req, res) => {
   try {
      const { first_name, last_name, email, age, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(400).json({ message: 'El email ya está en uso' });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = new User({ first_name, last_name, email, age, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: 'Usuario registrado exitosamente' });
   } catch (error) {
      res.status(500).json({ message: 'Error al registrar usuario', error });
   }
});

// Ruta de login
router.post('/login', async (req, res) => {
   try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !bcrypt.compareSync(password, user.password)) {
         return res.status(400).json({ message: 'Email o contraseña incorrectos' });
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true }).json({ message: 'Login exitoso' });
   } catch (error) {
      res.status(500).json({ message: 'Error al iniciar sesión', error });
   }
});



// Ruta para obtener al usuario logueado
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
       message: 'Usuario autenticado',
       user: req.user, 
    });
 });

module.exports = router;
