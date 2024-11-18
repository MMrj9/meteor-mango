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

const Notification = new Mongo.Collection<Notification>('notification')

Schemas.Notification = NotificationSchema
Collections.Notification = Notification

const simpleSchema: SimpleSchema = new SimpleSchema(
  formatSimpleSchema(NotificationSchema),
)
//@ts-ignore
Notification.attachSchema(simpleSchema)

export { Notification }
