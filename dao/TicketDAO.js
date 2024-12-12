const Ticket = require('../models/ticket');

class TicketDao {
  async createTicket(ticketData) {
    const ticket = new Ticket(ticketData);
    return await ticket.save();
  }
}

module.exports = new TicketDao();
