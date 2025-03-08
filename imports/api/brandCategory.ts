import { Mongo } from 'meteor/mongo'
// @ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'
import { Disabled, Timestamped } from './common'
import {
  Actions,
  AdminRoutes,
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

export interface BrandCategoryInterface extends Timestamped, Disabled {
  _id?: string
  name: string
  description?: string
  image?: string
}

const BrandCategorySchema: Record<string, FieldProperties> = {
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
    formFieldType: FormFieldType.TEXTAREA,
    optional: true,
  },
  images: {
    type: String,
    label: 'Image',
    formFieldType: FormFieldType.IMAGE,
    optional: true,
  },
  ...TimestampedSchemaBase,
  ...DisabledSchemaBase,
}

const BrandCategoryCollectionName = 'BrandCategory'
const BrandCategory = new Mongo.Collection<BrandCategoryInterface>(
  BrandCategoryCollectionName,
)

Schemas[BrandCategoryCollectionName] = BrandCategorySchema
Collections[BrandCategoryCollectionName] = BrandCategory

const simpleSchema: SimpleSchema = new SimpleSchema(
  formatSimpleSchema(BrandCategorySchema),
)
// @ts-ignore
BrandCategory.attachSchema(simpleSchema)

Actions[BrandCategoryCollectionName] = [BaseDisableAction, BaseEnableAction]
Filters[BrandCategoryCollectionName] = [DisabledTableFilter]
AdminRoutes[BrandCategoryCollectionName] = BrandCategoryCollectionName
RelatedCollections[BrandCategoryCollectionName] = [
  { collectionName: 'Brand', relatedCollectionField: 'categories', relateField: 'name' },
]

export { BrandCategory, BrandCategorySchema, BrandCategoryCollectionName }
