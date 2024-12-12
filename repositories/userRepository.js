// src/repositories/userRepository.js
const userDao = require('../daos/UserDao');
const UserDTO = require('../dtos/UserDTO');

class UserRepository {
    async createUser(userData) {
        const user = await userDao.createUser(userData);
        return new UserDTO(user);  // Devuelvo un DTO con la información relevante
    }

    async getUserById(id) {
        const user = await userDao.getUserById(id);
        return new UserDTO(user);
    }

    async getAllUsers() {
        const users = await userDao.getAllUsers();
        return users.map(user => new UserDTO(user));
    }

    async updateUser(id, userData) {
        const user = await userDao.updateUser(id, userData);
        return new UserDTO(user);
    }

    async deleteUser(id) {
        await userDao.deleteUser(id);
    }
}

module.exports = new UserRepository();
