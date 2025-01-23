import { Mongo } from 'meteor/mongo'
//@ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'
import {
  Collections,
  DisabledSchemaBase,
  FieldProperties,
  Schemas,
  TimestampedSchemaBase,
} from '.'
import { Timestamped, Disabled } from './common'
import { formatSimpleSchema } from './utils/simpleSchema'

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

const TicketSchema: Record<string, FieldProperties> = {
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
}

const collectionName = 'Ticket'
const Ticket = new Mongo.Collection<Ticket>('Ticket')

Schemas[collectionName] = TicketSchema
Collections[collectionName] = Ticket

const simpleSchema: SimpleSchema = new SimpleSchema(
  formatSimpleSchema(TicketSchema),
)
//@ts-ignore
Ticket.attachSchema(simpleSchema)

export { Ticket, TicketType }
