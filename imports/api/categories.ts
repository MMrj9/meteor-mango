import { Mongo } from 'meteor/mongo';

export interface Test {
  _id?: string;
  name: string;
}

export const Categories = new Mongo.Collection<Test>('test');

