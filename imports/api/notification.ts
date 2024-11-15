import { Mongo } from 'meteor/mongo'
//@ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'
import Schema, { DisabledSchemaBase, FieldProperties, TimestampedSchemaBase } from '.'
import { Timestamped, Disabled } from './common'
import { stripMetadata } from './utils/simpleSchema'

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

Schema.Notification = new SimpleSchema(stripMetadata(NotificationSchema))

const Notification = new Mongo.Collection<Notification>('notification')

//@ts-ignore
Notification.attachSchema(Schema.Notification)

export { Notification }
