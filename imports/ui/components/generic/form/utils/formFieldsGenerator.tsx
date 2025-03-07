import { ArrayFieldType, FormField, FormFieldType } from './types'
import { FieldProperties } from '/imports/api'
//@ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'

// Generalized function to extract specific properties with better type inference
const extractFieldProperty = <K extends keyof FieldProperties>(
  fieldProperties: FieldProperties,
  propertyName: K,
  defaultValue: FieldProperties[K],
): FieldProperties[K] => {
  return fieldProperties.hasOwnProperty(propertyName)
    ? fieldProperties[propertyName]
    : defaultValue
}

// Utility functions
const getTypeProperty = (fieldProperties: FieldProperties): FormFieldType => {
  if (fieldProperties.formFieldType) return fieldProperties.formFieldType

  switch (fieldProperties.type) {
    case String:
      return FormFieldType.TEXT
    case SimpleSchema.Integer:
    case Number:
      return FormFieldType.NUMBER
    case Boolean:
      return FormFieldType.CHECKBOX
    case Array:
      return FormFieldType.ARRAY
    default:
      return FormFieldType.TEXT
  }
}

const getDisabledProperty = (fieldProperties: FieldProperties): boolean =>
  extractFieldProperty(fieldProperties, 'editable', true) === false

const getMinProperty = (fieldProperties: FieldProperties): number | undefined =>
  extractFieldProperty(fieldProperties, 'min', undefined)

const getMaxProperty = (fieldProperties: FieldProperties): number | undefined =>
  extractFieldProperty(fieldProperties, 'max', undefined)

const getFormatProperty = (
  fieldProperties: FieldProperties,
): ((value: any) => any) | undefined =>
  extractFieldProperty(fieldProperties, 'format', undefined)

const getOptions = (
  fieldProperties: FieldProperties,
): { value: string; label: string }[] | undefined =>
  extractFieldProperty(fieldProperties, 'options', undefined)

const generateSubSchema = (
  schema: Record<string, FieldProperties>,
  baseKey: string,
): Record<string, FieldProperties> => {
  const subSchema: Record<string, FieldProperties> = {}

  for (const key in schema) {
    if (key.startsWith(baseKey)) {
      const subKey = key.slice(baseKey.length + 1)
      if (subKey) {
        subSchema[subKey] = { ...schema[key] }
        delete schema[`${baseKey}.${subKey}`]
      }
    }
  }

  return subSchema
}

const generateFormFields = (
  schema: Record<string, FieldProperties>,
): Record<string, FormField> => {
  const formFields: Record<string, FormField> = {}

  const processField = (
    fieldName: string,
    fieldProperties: FieldProperties,
  ) => {
    if (!fieldProperties.label) return

    const field: FormField = {
      label: fieldProperties.label,
      disabled: getDisabledProperty(fieldProperties),
      type: getTypeProperty(fieldProperties),
      min: getMinProperty(fieldProperties),
      max: getMaxProperty(fieldProperties),
      format: getFormatProperty(fieldProperties),
      options: getOptions(fieldProperties),
    }

    const cleanedField = Object.fromEntries(
      Object.entries(field).filter(([_, value]) => value !== undefined),
    ) as FormField

    if (fieldProperties.type === Array) {
      cleanedField.type = FormFieldType.ARRAY
      const baseFielPath = `${fieldName}.$`
      const objectSchema = generateSubSchema(schema, baseFielPath)
      const arrayType = schema[baseFielPath]?.formFieldType
      if (Object.keys(objectSchema).length > 0) {
        cleanedField.objectFields = generateFormFields(objectSchema)
        cleanedField.arrayType = ArrayFieldType.OBJECT
      } else if (fieldProperties.formFieldType === FormFieldType.AUTOCOMPLETE) {
        cleanedField.type = FormFieldType.AUTOCOMPLETE
      } else if (arrayType) {
        cleanedField.arrayType = arrayType as any
      }
      if (fieldProperties.options) {
        cleanedField.options = fieldProperties.options
      }
      else if (fieldProperties.optionsCollection && fieldProperties.optionsCollectionKey) {
        const key = fieldProperties.optionsCollectionKey
        cleanedField.options = fieldProperties.optionsCollection.find().map(
          (doc: any) => ({ value: doc[key], label: doc[key] }))
      }
    } else if (fieldProperties.allowedValues) {
      cleanedField.options = fieldProperties.allowedValues.map(
        (value: string | number) => ({ value, label: value }),
      )
      cleanedField.type = FormFieldType.SELECT
    }

    formFields[fieldName] = cleanedField
  }

  Object.keys(schema).forEach((fieldName) => {
    const fieldProperties = schema[fieldName]
    if (schema[fieldName]) processField(fieldName, fieldProperties)
  })

  return formFields
}

// Generate default values based on schema
const generateDefaultValues = (
  schema: Record<string, FieldProperties>,
): Record<string, any> => {
  const defaultValues: Record<string, any> = {}

  Object.keys(schema).forEach((fieldName) => {
    const fieldProperties = schema[fieldName]
    if (fieldProperties.defaultValue !== undefined) {
      defaultValues[fieldName] = fieldProperties.defaultValue
    } else {
      switch (fieldProperties.type) {
        case String:
          defaultValues[fieldName] = ''
          break
        case SimpleSchema.Integer:
        case Number:
          defaultValues[fieldName] = 0
          break
        case Boolean:
          defaultValues[fieldName] = false
          break
        case Array:
          defaultValues[fieldName] = []
          break
        case Object:
          defaultValues[fieldName] = {}
          break
        case Date:
          defaultValues[fieldName] = new Date()
          break
        default:
          defaultValues[fieldName] = null
      }
    }
  })

  return defaultValues
}

export {
  extractFieldProperty,
  getTypeProperty,
  getDisabledProperty,
  getMinProperty,
  getMaxProperty,
  getFormatProperty,
  getOptions,
  generateFormFields,
  generateDefaultValues,
}
