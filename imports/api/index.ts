import 'meteor/aldeed:collection2/dynamic'
import { FormFieldType } from '../ui/components/generic/form/Form'

//@ts-ignore
Collection2.load()

const Schema: any = {
  Company: null,
  User: null,
}

interface FieldProperties {
  type: any
  label?: string
  min?: number
  max?: number
  optional?: boolean 
  editable?: boolean
  formFieldType?: FormFieldType
}

const TimestampedSchemaBase: Record<string, FieldProperties> = {
  createdOn: {
    type: Date,
    label: 'Created On',
    editable: false
  },
  updatedOn: {
    type: Date,
    label: 'Updated On',
    optional: true,
    editable: false
  },
}

const DisabledSchemaBase = {
  disabled: {
    type: Boolean,
    optional: true,
  },
}

export { TimestampedSchemaBase, DisabledSchemaBase, FieldProperties }
export default Schema
