import { Mongo } from 'meteor/mongo'
import { Timestamped } from './common'

export interface Company extends Timestamped {
  _id?: string
  name: string
  description: string
  employees: number
}

export const Company = new Mongo.Collection<Company>('company')
