import { Mongo } from 'meteor/mongo'
// @ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'
import {
  commonStringArray,
  commonStringArrayItem,
  Disabled,
  Timestamped,
} from './common'
import {
  Actions,
  AdminRoutes,
  BulkActions,
  Collections,
  DisabledSchemaBase,
  FieldProperties,
  Filters,
  RelatedCollections,
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
import { BrandCategory } from './brandCategory'

export interface BrandInterface extends Timestamped, Disabled {
  _id?: string
  name: string
  description: string
  website?: string
  email?: string
  socialNetworks: { name: string; link: string }[]
  categories: string[]
  images: string[]
  foundingDate?: Date
  founders?: string[]
  locations?: string[]
  numberOfEmployees?: string
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
    max: 5000,
    optional: true,
    formFieldType: FormFieldType.TEXTAREA,
  },
  website: {
    type: String,
    label: 'Website',
    optional: true,
    // regEx: SimpleSchema.RegEx.Url,
  },
  email: {
    type: String,
    label: 'Email',
    optional: true,
    // regEx: SimpleSchema.RegEx.Email,
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
    // regEx: SimpleSchema.RegEx.Url,
  },
  categories: {
    type: Array,
    label: 'Categories',
    optionsCollection: BrandCategory,
    optionsCollectionKey: 'name',
    formFieldType: FormFieldType.AUTOCOMPLETE,
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
  foundingDate: {
    type: Date,
    label: 'Founding Date',
    optional: true,
    formFieldType: FormFieldType.DATE,
  },
  founders: {
    ...commonStringArray,
    label: 'Founders',
    optional: true,
  },
  'founders.$': commonStringArrayItem,
  locations: {
    ...commonStringArray,
    label: 'Locations',
    optional: true,
  },
  'locations.$': commonStringArrayItem,
  numberOfEmployees: {
    type: String,
    label: 'Number of Employees',
    optional: true,
    allowedValues: [
      ,
      '1-10',
      '11-50',
      '51-200',
      '201-500',
      '501-1000',
      '1000+',
    ],
  },
  ...TimestampedSchemaBase,
  ...DisabledSchemaBase,
}

const BrandCollectionName = 'Brand'
const Brand = new Mongo.Collection<BrandInterface>(BrandCollectionName)

Schemas[BrandCollectionName] = BrandSchema
Collections[BrandCollectionName] = Brand

const simpleSchema: SimpleSchema = new SimpleSchema(
  formatSimpleSchema(BrandSchema),
)
// @ts-ignore
Brand.attachSchema(simpleSchema)

Actions[BrandCollectionName] = [BaseDisableAction, BaseEnableAction]
BulkActions[BrandCollectionName] = [BaseDisableAction, BaseEnableAction]
Filters[BrandCollectionName] = [DisabledTableFilter]
AdminRoutes[BrandCollectionName] = BrandCollectionName
RelatedCollections[BrandCollectionName] = [
  {
    collectionName: 'BrandCategory',
    relatedCollectionField: 'name',
    relateField: 'categories',
    relateFieldQuery: '$in',
  },
]

export { Brand, BrandSchema, BrandCollectionName }
