const express = require('express');
const passport = require('passport');
const Ticket = require('../models/ticket');
const Cart = require('../models/cart');
const Product = require('../models/product.model');

const router = express.Router();

// Ruta para generar un ticket de compra después de finalizar un carrito
router.post('/:cid/purchase', passport.authenticate('current', { session: false }), async (req, res) => {
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

// Ruta para obtener un ticket por su código
router.get('/:ticketId', async (req, res) => {
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
    }

    return res.json(ticket);
});

// Ruta para obtener todos los tickets de un usuario
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;

    const tickets = await Ticket.find({ purchaser: userId });
    if (!tickets || tickets.length === 0) {
        return res.status(404).json({ error: 'No tickets found for this user' });
    }

    return res.json(tickets);
});

module.exports = router;
