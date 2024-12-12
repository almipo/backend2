const express = require('express');
const passport = require('passport');
const Cart = require('../models/cart');
const Product = require('../models/product.model');
const Ticket = require('../models/ticket');

const router = express.Router();

router.put('/:cid/purchase', passport.authenticate('current', { session: false }), async (req, res) => {
    const { cid } = req.params;
    const userId = req.user._id;
    
    // Obtener el carrito del usuario
    const cart = await Cart.findById(cid).populate('products.product').lean();
    if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
    }

    // Verificar stock de productos en el carrito
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

    // Crear ticket si se han procesado productos
    if (productsToProcess.length > 0) {
        const totalAmount = productsToProcess.reduce((total, item) => total + (item.product.price * item.quantity), 0);

        const newTicket = new Ticket({
            code: `TICKET-${Date.now()}`,
            amount: totalAmount,
            purchaser: req.user.email
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
});

module.exports = router;
