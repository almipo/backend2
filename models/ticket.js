
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
    default: () => `TICKET-${Date.now()}`, // Genera un código único basado en la fecha
  },
  purchase_datetime: {
    type: Date,
    default: Date.now, // Fecha y hora exacta de creación
    required: true,
  },
  amount: {
    type: Number,
    required: true, // Total de la compra
  },
  purchaser: {
    type: String,
    required: true, // Correo del usuario asociado al carrito
  },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
