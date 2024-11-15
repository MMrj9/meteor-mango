import { Mongo } from 'meteor/mongo'
//@ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'
import { Disabled, Timestamped } from './common'
import Schema, { DisabledSchemaBase, FieldProperties, TimestampedSchemaBase } from '.'
import { stripMetadata } from './utils/simpleSchema'

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
  },
  description: {
    type: String,
    label: 'Description',
    min: 0,
    max: 300,
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

Schema.Company = new SimpleSchema(stripMetadata(CompanySchema))

const Company = new Mongo.Collection<Company>('company')

//@ts-ignore
Company.attachSchema(Schema.Company)

export { Company, CompanySchema }
