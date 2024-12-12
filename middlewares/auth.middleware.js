const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { authMiddleware };
