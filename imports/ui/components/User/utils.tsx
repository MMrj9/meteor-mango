// @ts-ignore
import { Roles } from 'meteor/alanning:roles'
import { FormField } from '../generic/form/Form'
import _ from 'lodash'

const mapValuesToAutocompleteOptions = (
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

export { mapValuesToAutocompleteOptions }
