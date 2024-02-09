import { Mongo } from 'meteor/mongo'
//@ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'
import Schema, { DisabledSchemaBase, TimestampedSchemaBase } from '.'
import { Timestamped, Disabled } from './common'

interface Notification extends Timestamped, Disabled {
  _id: string
  content: string
  user: string
  path?: string
}

Schema.Notification = new SimpleSchema({
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
})

const Notification = new Mongo.Collection<Notification>('notification')

//@ts-ignore
Notification.attachSchema(Schema.Notification)

export { Notification }
