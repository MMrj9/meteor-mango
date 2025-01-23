import 'meteor/aldeed:collection2/dynamic'
import { FormFieldType } from '../ui/components/generic/form/GenericForm'

//@ts-ignore
Collection2.load()

const Schemas: any = {}
const Collections: any = {}
const Actions: any = {}

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
}

const TimestampedSchemaBase: Record<string, FieldProperties> = {
  createdOn: {
    type: Date,
    label: 'Created On',
    editable: false,
    tableView: true
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
  CustomSchemaTypes,
}
