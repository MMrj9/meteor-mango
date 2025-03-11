import 'meteor/aldeed:collection2/dynamic'
import { TableFilter } from '../ui/components/generic/filters/Filters'
import { Action } from '../ui/components/generic/actions/Actions'
import { FormFieldType } from '../ui/components/generic/form/utils/types'
import { Mongo } from 'meteor/mongo'

//@ts-ignore
Collection2.load()

const Schemas: Record<string, any> = {}
const Collections: Record<string, any> = {}
const Actions: Record<string, Action[]> = {}
const Filters: Record<string, TableFilter[]> = {}
const AdminRoutes: Record<string, string> = {}
const RelatedCollections: Record<string, RelatedCollectionConfig[]> = {}

enum CustomSchemaTypes {
  ANY = 'ANY',
}

interface SimpleSchemaField {
  type: any
  label?: string
  optional?: boolean
  min?: number
  max?: number
  defaultValue?: any
  allowedValues?: any[]
  autoValue?: () => any
  custom?: (value: any, obj: any) => string | undefined
  blackbox?: boolean
  decimal?: boolean
  exclusiveMin?: number
  exclusiveMax?: number
  regEx?: RegExp | RegExp[]
  [key: string]: any // Allow additional nested fields
}

interface FieldProperties extends SimpleSchemaField {
  editable?: boolean
  formFieldType?: FormFieldType
  tableView?: boolean
  options?: { value: string; label: string }[]
  optionsCollection?: Mongo.Collection<any> | string
  optionsCollectionKey?: string
}

export interface RelatedCollectionConfig {
  collectionName: string
  relatedCollectionField?: string
  relateField?: string
  relateFieldQuery?: string
}

const TimestampedSchemaBase: Record<string, FieldProperties> = {
  createdOn: {
    type: Date,
    label: 'Created On',
    editable: false,
    tableView: true,
  },
  updatedOn: {
    type: Date,
    label: 'Updated On',
    optional: true,
    editable: false,
  },
}

const DisabledSchemaBase = {
  disabled: {
    type: Boolean,
    optional: true,
  },
}

export {
  TimestampedSchemaBase,
  DisabledSchemaBase,
  FieldProperties,
  SimpleSchemaField,
  Schemas,
  Collections,
  Actions,
  Filters,
  AdminRoutes,
  RelatedCollections,
  CustomSchemaTypes,
}
