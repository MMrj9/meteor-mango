import { Meteor } from 'meteor/meteor'
import { logChanges } from '/imports/api/changelog'
import { Ticket } from '/imports/api/ticket'
import { sendNotificationToGroups } from './notification'
import { insertOrUpdate } from './common'

Meteor.methods({
  'Ticket.insertOrUpdate'(ticket: Ticket) {
    const [_id, created] = insertOrUpdate('Ticket', ticket)
    if (created) {
      sendNotificationToGroups(
        ['admin'],
        `[Ticket Created] ${ticket.subject}`,
        `/admin/ticket/edit/${_id}`,
      )
    }
  },
})
