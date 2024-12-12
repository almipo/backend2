const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

class UserController {
  async register(req, res) {
    try {
      const user = await userService.registerUser(req.body);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const user = await userService.loginUser(req.body.email, req.body.password);
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async current(req, res) {
    try {
      const user = await userService.getUserById(req.user.id);
      res.status(200).json({ user });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
