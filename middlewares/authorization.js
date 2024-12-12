const passport = require('passport');

const adminRole = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ error: 'Access denied' });
};

const userRole = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        return next();
    }
    return res.status(403).json({ error: 'Access denied' });
};

module.exports = { adminRole, userRole };
