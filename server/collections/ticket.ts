import { Meteor } from 'meteor/meteor'
import { logChanges } from '/imports/api/changelog'
import { Ticket } from '/imports/api/ticket'
import { sendNotificationToGroups } from './notification'

Meteor.methods({
  'ticket.insertOrUpdate'(ticket: Ticket) {
    if (ticket._id) {
      const existingTicket = Ticket.findOne(ticket._id)

      logChanges(ticket._id, 'ticket', 'update', existingTicket, ticket)

      ticket.updatedOn = new Date()
      Ticket.update(ticket._id, { $set: ticket })
    } else {
      ticket.createdOn = new Date()
      const _id = Ticket.insert(ticket)
      sendNotificationToGroups(
        ['admin'],
        `[Ticket Created] ${ticket.subject}`,
        `/admin/ticket/edit/${_id}`,
      )
    }
  },
})
