import { Mongo } from 'meteor/mongo'
//@ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'
import {
  Actions,
  Collections,
  DisabledSchemaBase,
  FieldProperties,
  Filters,
  Schemas,
  TimestampedSchemaBase,
} from '.'
import { Timestamped, Disabled } from './common'
import { formatSimpleSchema } from './utils/simpleSchema'
import { BaseDisableAction, BaseEnableAction } from '../ui/components/generic/actions/Actions'
import { DisabledTableFilter } from '../ui/components/generic/filters/Filters'

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
    tableView: true
  },
  name: {
    type: String,
    label: 'Name',
    tableView: true
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: 'Email',
    tableView: true
  },
  subject: {
    type: String,
    label: 'Subject',
    tableView: true
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

Actions[collectionName] = [BaseDisableAction, BaseEnableAction]
Filters[collectionName] = [DisabledTableFilter]

export { Ticket, TicketType }
