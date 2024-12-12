const cartDao = require('../daos/cartDao');

class CartService {
  async createCart() {
    return await cartDao.createCart();
  }

  async getCartById(id) {
    return await cartDao.getCartById(id);
  }

  async updateCart(id, products) {
    return await cartDao.updateCart(id, products);
  }
}

module.exports = new CartService();
