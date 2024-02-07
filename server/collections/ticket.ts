import { Meteor } from 'meteor/meteor'
import { logChanges } from '/imports/api/changelog'
import { Ticket } from '/imports/api/ticket'

Meteor.methods({
  'ticket.insertOrUpdate'(ticket: Ticket) {
    if (ticket._id) {
      const existingTicket = Ticket.findOne(ticket._id)

      logChanges(ticket._id, 'ticket', 'update', existingTicket, ticket)

      ticket.updated_on = new Date()
      Ticket.update(ticket._id, { $set: ticket })
    } else {
      ticket.createdOn = new Date()
      Ticket.insert(ticket)
    }
  },
})
