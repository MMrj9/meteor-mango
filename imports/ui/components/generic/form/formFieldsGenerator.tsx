import { FormField, FormFieldType } from "./Form";
import { FieldProperties } from "/imports/api";
//@ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'

const getDisabledProperty = (fieldProperties: FieldProperties): boolean => fieldProperties.hasOwnProperty('editable') && fieldProperties['editable'] === false

const getTypeProperty = (fieldProperties: FieldProperties): FormFieldType => {
    if (fieldProperties.formFieldType) return fieldProperties.formFieldType
    switch (fieldProperties.type) {
        case String:
            return FormFieldType.TEXT
        case SimpleSchema.Integer:
            return FormFieldType.NUMBER
        case Array:
            return FormFieldType.ARRAY
        default:
            return FormFieldType.TEXT
    }
}

const generateFormFields = (schema: Record<string, FieldProperties>): Record<string, FormField> => {
    const formFields: Record<string, FormField> = {}
    Object.keys(schema).forEach((fieldName: string) => {
        const fieldProperties: FieldProperties = schema[fieldName]
        if (!fieldProperties.label) return
        formFields[fieldName] = {
            label: fieldProperties.label,
            disabled: getDisabledProperty(fieldProperties),
            type: getTypeProperty(fieldProperties)
        }

    })
    return formFields
}