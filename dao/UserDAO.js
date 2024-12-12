
const User = require('../models/user');

class UserDao {
    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async getUserById(id) {
        return await User.findById(id);
    }

    async getAllUsers() {
        return await User.find();
    }

    async updateUser(id, userData) {
        return await User.findByIdAndUpdate(id, userData, { new: true });
    }

    async deleteUser(id) {
        return await User.findByIdAndDelete(id);
    }
}

module.exports = new UserDao();
