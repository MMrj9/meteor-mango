import { Mongo } from 'meteor/mongo'
//@ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'
import { Disabled, Timestamped } from './common'
import {
  Actions,
  Collections,
  DisabledSchemaBase,
  FieldProperties,
  Schemas,
  TimestampedSchemaBase,
} from '.'
import { formatSimpleSchema } from './utils/simpleSchema'
import { BaseDisableAction, BaseEnableAction } from '../ui/components/generic/actions/Actions'

export interface Company extends Timestamped, Disabled {
  _id?: string
  name: string
  description: string
  numberOfEmployees: number
  tags: string[]
}

const CompanySchema: Record<string, FieldProperties> = {
  name: {
    type: String,
    label: 'Name',
    min: 1,
    max: 50,
    tableView: true
  },
  description: {
    type: String,
    label: 'Description',
    min: 0,
    max: 300,
    tableView: true
  },
  numberOfEmployees: {
    type: SimpleSchema.Integer,
    label: 'Number of Employees',
    min: 0,
    max: 999,
  },
  tags: {
    type: Array,
    label: 'Tags',
  },
  'tags.$': {
    type: String,
  },
  ...TimestampedSchemaBase,
  ...DisabledSchemaBase,
}

const collectionName = 'Company'
const Company = new Mongo.Collection<Company>(collectionName)

Schemas[collectionName] = CompanySchema
Collections[collectionName] = Company

const simpleSchema: SimpleSchema = new SimpleSchema(
  formatSimpleSchema(CompanySchema),
)
//@ts-ignore
Company.attachSchema(simpleSchema)


Actions[collectionName] = [BaseDisableAction, BaseEnableAction]

export { Company, CompanySchema }
