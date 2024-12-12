const express = require('express');
const passport = require('passport');
const authorization = require('../middlewares/authorization'); 
const Cart = require('../models/cart');
const Product = require('../models/product.model');
const Ticket = require('../models/ticket');

const router = express.Router();

// Ruta para agregar un producto al carrito (solo usuarios)
router.post('/:cid/products/:pid', 
  passport.authenticate('jwt', { session: false }), 
  authorization('user'),
  async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;

      const cart = await Cart.findById(cid);
      if (!cart) return res.status(404).json({ error: 'Cart not found' });

      const product = await Product.findById(pid);
      if (!product) return res.status(404).json({ error: 'Product not found' });

      // Verificar si el producto ya está en el carrito
      const existingProduct = cart.products.find(item => item.product.toString() === pid);
      if (existingProduct) {
        // Incrementar la cantidad
        existingProduct.quantity += quantity;
      } else {
        // Agregar el producto al carrito
        cart.products.push({ product: pid, quantity });
      }

      await cart.save();
      res.json({ message: 'Product added to cart', cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Ruta para finalizar la compra y generar un ticket (solo usuarios)
router.put('/:cid/purchase', 
  passport.authenticate('jwt', { session: false }), 
  authorization('user'), 
  async (req, res) => {
    try {
      const { cid } = req.params;

      // Obtener el carrito del usuario
      const cart = await Cart.findById(cid).populate('products.product').lean();
      if (!cart) return res.status(404).json({ error: 'Cart not found' });

      let productsToProcess = [];
      let productsNotProcessed = [];

      for (const item of cart.products) {
        const product = item.product;
        const quantityInCart = item.quantity;

        if (product.stock >= quantityInCart) {
          // Actualizar el stock
          product.stock -= quantityInCart;
          await product.save();
          productsToProcess.push(item);
        } else {
          productsNotProcessed.push(product._id);
        }
      }

      // Crear ticket si se procesaron productos
      if (productsToProcess.length > 0) {
        const totalAmount = productsToProcess.reduce(
          (total, item) => total + (item.product.price * item.quantity),
          0
        );

        const newTicket = new Ticket({
          code: `TICKET-${Date.now()}`,
          amount: totalAmount,
          purchaser: req.user.email,
        });

        await newTicket.save();

        // Limpiar productos procesados del carrito
        const productIdsToProcess = productsToProcess.map(item => item.product._id);
        await Cart.findByIdAndUpdate(cid, {
          $pull: { products: { product: { $in: productIdsToProcess } } }
        });

        return res.json({
          message: 'Purchase completed successfully',
          ticket: newTicket,
          notProcessedProducts: productsNotProcessed
        });
      }

      return res.status(400).json({
        message: 'No products were processed',
        notProcessedProducts: productsNotProcessed
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;
