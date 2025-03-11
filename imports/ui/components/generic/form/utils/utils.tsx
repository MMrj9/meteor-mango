// @ts-ignore
import { Roles } from 'meteor/alanning:roles'
import _ from 'lodash'
import { FormField } from './types'

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
  return values
}

export { mapValuesToOptions, processFormFieldsValues }
