const userDao = require('../daos/userDao');
const bcrypt = require('bcrypt');

class UserService {
  async registerUser(userData) {
    return await userDao.createUser(userData);
  }

  async loginUser(email, password) {
    const user = await userDao.getUserByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error('Invalid credentials');
    }
    return user;
  }

  async getUserById(id) {
    return await userDao.getUserById(id);
  }
}

module.exports = new UserService();
