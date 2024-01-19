import { Mongo } from 'meteor/mongo';

export interface Company {
  _id?: string;
  name: string;
  description: string;
  employees: number;
}


export const Company = new Mongo.Collection<Company>('company');

