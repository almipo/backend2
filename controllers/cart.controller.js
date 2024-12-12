const cartService = require('../services/cartService');
const ticketService = require('../services/ticketService');

class CartController {
  async purchase(req, res) {
    try {
      const cart = await cartService.getCartById(req.params.cid);
      const productsNotAvailable = [];
      let totalAmount = 0;

      for (const item of cart.products) {
        if (item.product.stock >= item.quantity) {
          item.product.stock -= item.quantity;
          totalAmount += item.product.price * item.quantity;
        } else {
          productsNotAvailable.push(item.product._id);
        }
      }

      if (productsNotAvailable.length > 0) {
        cart.products = cart.products.filter(
          (item) => !productsNotAvailable.includes(item.product._id)
        );
        await cartService.updateCart(cart._id, cart.products);
        return res.status(400).json({ productsNotAvailable });
      }

      const ticket = await ticketService.createTicket(totalAmount, req.user.email);
      res.status(200).json({ ticket });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CartController();
