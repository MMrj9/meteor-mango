import { Mongo } from 'meteor/mongo'
//@ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'
import Schema, { DisabledSchemaBase, TimestampedSchemaBase } from '.'
import { Disabled, Timestamped } from './common'

interface AdminComment extends Timestamped, Disabled {
  _id: string
  objectId: string
  collection: string
  user: string
  text: string
}

Schema.AdminComment = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
  },
  objectId: {
    type: String,
    label: 'Object ID',
  },
  collection: {
    type: String,
    label: 'Collection',
  },
  user: {
    type: String,
    label: 'User Username',
  },
  text: {
    type: String,
    label: 'text',
  },
  ...TimestampedSchemaBase,
  ...DisabledSchemaBase,
})

const AdminComment = new Mongo.Collection<AdminComment>('admincomment')

//@ts-ignore
AdminComment.attachSchema(Schema.AdminComment)

export { AdminComment }
