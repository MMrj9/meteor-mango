import { Mongo } from 'meteor/mongo'
//@ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'
import Schema, { DisabledSchemaBase, TimestampedSchemaBase } from '.'
import { Timestamped, Disabled } from './common'

enum TicketType {
  Issue = 'Issue',
  Suggestion = 'Suggestion',
  Request = 'Request',
}

interface Ticket extends Timestamped, Disabled {
  _id: string
  name: string
  email: string
  subject: string
  content: string
  type: TicketType
  user?: string
}

Schema.Ticket = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
  },
  type: {
    type: String,
    allowedValues: Object.values(TicketType),
    label: 'Type',
  },
  name: {
    type: String,
    label: 'Name',
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: 'Email',
  },
  subject: {
    type: String,
    label: 'Subject',
  },
  content: {
    type: String,
    label: 'Content',
  },
  user: {
    type: String,
    label: 'User Username',
    optional: true,
  },
  ...TimestampedSchemaBase,
  ...DisabledSchemaBase,
})

const Ticket = new Mongo.Collection<Ticket>('ticket')

//@ts-ignore
Ticket.attachSchema(Schema.Ticket)

export { Ticket, TicketType }
