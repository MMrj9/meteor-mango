// @ts-ignore
import { Roles } from 'meteor/alanning:roles'
import _ from 'lodash'
import { FormField } from '../GenericForm'

const mapValuesToOptions = (
  values: string[],
  path: string,
  formFields: Record<string, FormField>,
) => {
  //@ts-ignore
  _.set(
    formFields,
    path,
    values.map((role: string) => {
      return { value: role, label: role }
    }),
  )
}

const processFormFieldsValues = (
  fields: Record<string, FormField>,
  values: Record<string, any>,
) => {
  for (const key in fields) {
    const field = fields[key]

    if (field.type === 'autocomplete' && Array.isArray(values[key])) {
      // Process autocomplete field options to only contain the value
      const processedOptions = values[key].map(
        //@ts-ignore
        ({ value }) => value,
      )

      values[key] = processedOptions
    }
  }

  return values
}

export { mapValuesToOptions, processFormFieldsValues }
