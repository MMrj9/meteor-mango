import 'meteor/aldeed:collection2/dynamic'
import { FormFieldType } from '../ui/components/generic/form/GenericForm'
import { TableFilter } from '../ui/components/generic/filters/Filters'
import { Action } from '../ui/components/generic/actions/Actions'

//@ts-ignore
Collection2.load()

const Schemas: Record<string, any> = {}
const Collections: Record<string, any> = {}
const Actions: Record<string, Action[]> = {}
const Filters: Record<string, TableFilter[]> = {}

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
  CustomSchemaTypes,
}
