import { FormField } from './Form'
//@ts-ignore
import { Roles } from 'meteor/alanning:roles'

const processValues = (
  fields: Record<string, FormField>,
  values: Record<string, any>,
) => {
  for (const key in fields) {
    const field = fields[key]

    if (field.type === 'autocomplete' && Array.isArray(values[key])) {
      // Process autocomplete field options to only contain the value
      const processedAutocompleteOptions = values[key].map(
        //@ts-ignore
        ({ value }) => value,
      )

      values[key] = processedAutocompleteOptions
    }
  }

  return values
}

export { processValues }
