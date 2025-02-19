import { Mongo } from 'meteor/mongo'
//@ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'
import {
  Actions,
  AdminRoutes,
  Collections,
  DisabledSchemaBase,
  FieldProperties,
  Filters,
  Schemas,
  TimestampedSchemaBase,
} from '.'
import { Timestamped, Disabled } from './common'
import { formatSimpleSchema } from './utils/simpleSchema'
import {
  BaseDisableAction,
  BaseEnableAction,
} from '../ui/components/generic/actions/Actions'
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
    tableView: true,
  },
  name: {
    type: String,
    label: 'Name',
    tableView: true,
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: 'Email',
    tableView: true,
  },
  subject: {
    type: String,
    label: 'Subject',
    tableView: true,
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

const TicketCollectionName = 'Ticket'
const Ticket = new Mongo.Collection<Ticket>('Ticket')

Schemas[TicketCollectionName] = TicketSchema
Collections[TicketCollectionName] = Ticket

const simpleSchema: SimpleSchema = new SimpleSchema(
  formatSimpleSchema(TicketSchema),
)
//@ts-ignore
Ticket.attachSchema(simpleSchema)

Actions[TicketCollectionName] = [BaseDisableAction, BaseEnableAction]
Filters[TicketCollectionName] = [DisabledTableFilter]
AdminRoutes[TicketCollectionName] = 'Tickets'

export { Ticket, TicketType }
