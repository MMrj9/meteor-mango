import { Mongo } from 'meteor/mongo'
//@ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'
import { Disabled, Timestamped } from './common'
import Schema, { DisabledSchemaBase, TimestampedSchemaBase } from '.'

export interface Company extends Timestamped, Disabled {
  _id?: string
  name: string
  description: string
  numberOfEmployees: number
}

Schema.Company = new SimpleSchema({
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
  ...TimestampedSchemaBase,
  ...DisabledSchemaBase,
})

const Company = new Mongo.Collection<Company>('company')

//@ts-ignore
Company.attachSchema(Schema.Company)

export { Company }
