import React from 'react'
import { FormControl, FormLabel, Input } from '@chakra-ui/react'
import { FormField } from '../types'
import _ from 'lodash'

/**
 * Render a number field.
 */
export function renderNumberField(
  fieldName: string,
  fieldConfig: FormField,
  formik: any,
) {
  const { disabled, format, min, max, label } = fieldConfig
  const fieldValue = _.get(formik.values, fieldName)
  const formattedValue = format ? format(fieldValue) : fieldValue

  return (
    <FormControl key={fieldName} px={2} py={4}>
      {label && <FormLabel>{label}</FormLabel>}
      <Input
        type="number"
        name={fieldName}
        value={formattedValue || ''}
        onChange={formik.handleChange}
        disabled={disabled}
        min={min}
        max={max}
      />
    </FormControl>
  )
}
