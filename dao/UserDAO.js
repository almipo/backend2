const User = require('../models/user');

class UserDao {
  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async getUserByEmail(email) {
    return await User.findOne({ email });
  }

  async getUserById(id) {
    return await User.findById(id);
  }
}

module.exports = new UserDao();
