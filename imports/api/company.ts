import { Mongo } from 'meteor/mongo'
import { Timestamped } from './common'

export interface Company extends Timestamped {
  _id?: string
  name: string
  description: string
  employees: number
}

const CompanyFields = {
  name: {
    minCharacters: 1,
    maxCharacters: 50,
  },
  description: {
    minCharacters: 0,
    maxCharacters: 300,
  },
  employees: {
    minCharacters: 0,
    maxCharacters: 3,
  },
}

export const Company = new Mongo.Collection<Company>('company')

export { CompanyFields }
