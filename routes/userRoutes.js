// routes/user.routes.js

const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Ruta para registrar un usuario
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password, role } = req.body;

    try {
        const user = new User({ first_name, last_name, email, age, password, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Ruta para iniciar sesión y generar JWT
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    const token = jwt.sign({ id: req.user._id, email: req.user.email }, 'secretkey', { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
});

// Ruta para obtener los datos del usuario logueado
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user); // Retorna los datos del usuario logueado
});

// Ruta para obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Ruta para obtener un usuario por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
});

// Ruta para actualizar un usuario
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, age, password, role } = req.body;
    
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        user.email = email || user.email;
        user.age = age || user.age;
        user.password = password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10)) : user.password;
        user.role = role || user.role;

        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
});

// Ruta para eliminar un usuario
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
});

module.exports = router;
