import 'meteor/aldeed:collection2/dynamic'
import { FormFieldType } from '../ui/components/generic/form/Form'

//@ts-ignore
Collection2.load()

const Schema: any = {}

interface SimpleSchemaField {
  type: any;
  label?: string;
  optional?: boolean;
  min?: number;
  max?: number;
  defaultValue?: any;
  allowedValues?: any[];
  autoValue?: () => any;
  custom?: (value: any, obj: any) => string | undefined;
  blackbox?: boolean;
  decimal?: boolean;
  exclusiveMin?: number;
  exclusiveMax?: number;
  regEx?: RegExp | RegExp[];
  [key: string]: any; // Allow additional nested fields
}

interface FieldProperties extends SimpleSchemaField {
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

export { TimestampedSchemaBase, DisabledSchemaBase, FieldProperties, SimpleSchemaField }
export default Schema
