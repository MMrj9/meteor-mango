import { pick } from 'lodash'
//@ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'
import { CustomSchemaTypes, FieldProperties } from '..'

const SUPPORTED_SIMPLESCHEMA_FIELDS = [
  'type',
  'label',
  'optional',
  'min',
  'max',
  'defaultValue',
  'allowedValues',
  'autoValue',
  'custom',
  'blackbox',
  'decimal',
  'exclusiveMin',
  'exclusiveMax',
  'regEx',
]

const formatSimpleSchema = (
  schema: Record<string, FieldProperties>,
): Record<string, any> => {
  const simpleSchemaCompatible: Record<string, any> = {}
  for (const key in schema) {
    const field = schema[key]

    if (field.type === Array && field.schema) {
      simpleSchemaCompatible[key] = {
        type: Array,
        ...pick(field, SUPPORTED_SIMPLESCHEMA_FIELDS),
      }
      simpleSchemaCompatible[`${key}.$`] = new SimpleSchema(
        formatSimpleSchema(field.schema),
      )
    } else if (field.type === CustomSchemaTypes.ANY) {
      simpleSchemaCompatible[key] = {
        ...pick(field, SUPPORTED_SIMPLESCHEMA_FIELDS),
        type: SimpleSchema.oneOf(String, Number, Boolean, Date),
      }
    } else {
      simpleSchemaCompatible[key] = pick(field, SUPPORTED_SIMPLESCHEMA_FIELDS)
    }
  }
  return simpleSchemaCompatible
}

export { formatSimpleSchema }
