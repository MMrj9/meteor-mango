import { Mongo } from 'meteor/mongo'
// @ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'
import { Disabled, Timestamped } from './common'
import {
  Actions,
  Collections,
  DisabledSchemaBase,
  FieldProperties,
  Filters,
  Schemas,
  TimestampedSchemaBase,
} from '.'
import { formatSimpleSchema } from './utils/simpleSchema'
import {
  BaseDisableAction,
  BaseEnableAction,
} from '../ui/components/generic/actions/Actions'
import { DisabledTableFilter } from '../ui/components/generic/filters/Filters'
import { FormFieldType } from '../ui/components/generic/form/utils/types'

export interface BrandInterface extends Timestamped, Disabled {
  _id?: string
  name: string
  description: string
  website?: string
  email?: string
  socialNetworks: { name: string; link: string }[]
  categories: string[]
  images: string[]
}

const BrandSchema: Record<string, FieldProperties> = {
  name: {
    type: String,
    label: 'Name',
    min: 1,
    max: 100,
    tableView: true,
  },
  description: {
    type: String,
    label: 'Description',
    min: 0,
    max: 2000,
    tableView: true,
    formFieldType: FormFieldType.TEXTAREA,
  },
  website: {
    type: String,
    label: 'Website',
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
  },
  email: {
    type: String,
    label: 'Email',
    optional: true,
    regEx: SimpleSchema.RegEx.Email,
  },
  socialNetworks: {
    type: Array,
    label: 'Social Networks',
    optional: true,
  },
  'socialNetworks.$': {
    type: Object,
  },
  'socialNetworks.$.name': {
    type: String,
    label: 'Name',
    allowedValues: ['Facebook', 'Instagram', 'LinkedIn', 'YouTube'],
  },
  'socialNetworks.$.link': {
    type: String,
    label: 'Link',
    regEx: SimpleSchema.RegEx.Url,
  },
  categories: {
    type: Array,
    label: 'Categories',
  },
  'categories.$': {
    type: String,
  },
  images: {
    type: Array,
    label: 'Images',
  },
  'images.$': {
    type: String,
    formFieldType: FormFieldType.IMAGE,
  },
  ...TimestampedSchemaBase,
  ...DisabledSchemaBase,
}

const collectionName = 'Brand'
const Brand = new Mongo.Collection<BrandInterface>(collectionName)

Schemas[collectionName] = BrandSchema
Collections[collectionName] = Brand

const simpleSchema: SimpleSchema = new SimpleSchema(
  formatSimpleSchema(BrandSchema),
)
// @ts-ignore
Brand.attachSchema(simpleSchema)

Actions[collectionName] = [BaseDisableAction, BaseEnableAction]
Filters[collectionName] = [DisabledTableFilter]

export { Brand, BrandSchema }
