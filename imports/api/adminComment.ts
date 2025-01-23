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
import { Disabled, Timestamped } from './common'
import { formatSimpleSchema } from './utils/simpleSchema'

interface AdminComment extends Timestamped, Disabled {
  _id: string
  objectId: string
  collection: string
  user: string
  text: string
}

const AdminCommentSchema: Record<string, FieldProperties> = {
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
}

const collectionName = 'AdminComment'
const AdminComment = new Mongo.Collection<AdminComment>(collectionName)

Schemas[collectionName] = AdminCommentSchema
Collections[collectionName] = AdminComment

const simpleSchema: SimpleSchema = new SimpleSchema(
  formatSimpleSchema(AdminCommentSchema),
)
//@ts-ignore
AdminComment.attachSchema(simpleSchema)

export { AdminComment }
