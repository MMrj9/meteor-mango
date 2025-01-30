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
import {
  BaseDisableAction,
  BaseEnableAction,
} from '../ui/components/generic/actions/Actions'
import { NonDisabledFilter } from '../ui/components/generic/filters/Filters'

interface Notification extends Timestamped, Disabled {
  _id: string
  content: string
  user: string
  path?: string
}

const NotificationSchema: Record<string, FieldProperties> = {
  _id: {
    type: String,
    optional: true,
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
  path: {
    type: String,
    label: 'Path',
    optional: true,
  },
  ...TimestampedSchemaBase,
  ...DisabledSchemaBase,
}

const collectionName = 'Notification'
const Notification = new Mongo.Collection<Notification>(collectionName)

Schemas[collectionName] = NotificationSchema
Collections[collectionName] = Notification

const simpleSchema: SimpleSchema = new SimpleSchema(
  formatSimpleSchema(NotificationSchema),
)
//@ts-ignore
Notification.attachSchema(simpleSchema)

Actions[collectionName] = [
  {
    ...BaseDisableAction,
    label: 'Mark as read',
  },
  {
    ...BaseEnableAction,
    label: 'Mark as unread',
  },
]
Filters[collectionName] = [
  {
    key: 'active',
    label: 'Read/Unread',
    type: 'dropdown',
    options: [
      { label: 'All', value: null },
      {
        label: 'Unread',
        value: NonDisabledFilter,
      },
      { label: 'Read', value: { disabled: true } },
    ],
  },
]

export { Notification }
