const ticketDao = require('../daos/ticketDao');
const { v4: uuidv4 } = require('uuid');

class TicketService {
  async createTicket(amount, purchaser) {
    const ticketData = {
      code: uuidv4(),
      amount,
      purchaser
    };
    return await ticketDao.createTicket(ticketData);
  }
}

module.exports = new TicketService();
