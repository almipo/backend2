const Cart = require('../models/cart');

class CartDao {
  async createCart() {
    const cart = new Cart();
    return await cart.save();
  }

  async getCartById(id) {
    return await Cart.findById(id).populate('products.product');
  }

  async updateCart(id, products) {
    return await Cart.findByIdAndUpdate(id, { products }, { new: true });
  }
}

module.exports = new CartDao();
