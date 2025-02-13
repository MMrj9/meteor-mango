import React from 'react'
import { Checkbox, FormControl } from '@chakra-ui/react'
import { FormField } from '../types'
import _ from 'lodash'

/**
 * Render a checkbox field.
 */
export function renderCheckboxField(
  fieldName: string,
  fieldConfig: FormField,
  formik: any,
) {
  const { disabled, format, label } = fieldConfig
  const fieldValue = _.get(formik.values, fieldName)
  const formattedValue = format ? format(fieldValue) : fieldValue

  return (
    <FormControl key={fieldName} px={2} py={4}>
      <Checkbox
        name={fieldName}
        isChecked={!!formattedValue}
        onChange={formik.handleChange}
        isDisabled={disabled}
      >
        {label}
      </Checkbox>
    </FormControl>
  )
}
