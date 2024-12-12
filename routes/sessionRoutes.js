const express = require('express');
const passport = require('passport');
const { adminRole, userRole } = require('../middlewares/authorization.js');

const router = express.Router();

router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    return res.json({
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
    });
});

module.exports = router;
