import React from 'react'
import { FormControl, FormLabel, Input } from '@chakra-ui/react'
import { FormField } from '../types'
import _ from 'lodash'

/**
 * Render a date field.
 */
export function renderDateField(
  fieldName: string,
  fieldConfig: FormField,
  formik: any,
) {
  const { disabled, format, label } = fieldConfig
  const fieldValue = _.get(formik.values, fieldName)
  const formattedValue = format ? format(fieldValue) : fieldValue

  return (
    <FormControl key={fieldName} px={2} py={4}>
      {label && <FormLabel>{label}</FormLabel>}
      <Input
        type="date"
        name={fieldName}
        value={formattedValue || ''}
        onChange={formik.handleChange}
        disabled={disabled}
      />
    </FormControl>
  )
}
