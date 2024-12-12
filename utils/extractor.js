const jwt = require('jsonwebtoken');

const extractCookieToken = (req) => {
    const token = req.cookies.jwt;
    if (!token) {
        return null;
    }
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = { extractCookieToken };
