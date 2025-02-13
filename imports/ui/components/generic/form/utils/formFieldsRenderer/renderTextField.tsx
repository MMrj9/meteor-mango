import React from 'react'
import { FormControl, FormLabel, Input } from '@chakra-ui/react'
import { FormField, FormFieldType } from '../types'
import _ from 'lodash'

/**
 * Render a text field.
 */
export function renderTextField(
  fieldName: string,
  fieldConfig: FormField,
  formik: any,
) {
  const { disabled, format, type, min, max, label } = fieldConfig
  const fieldValue = _.get(formik.values, fieldName)
  const formattedValue = format ? format(fieldValue) : fieldValue

  return (
    <FormControl key={fieldName} px={2} py={4}>
      {label && <FormLabel>{label}</FormLabel>}
      <Input
        type={type === FormFieldType.TEXT ? 'text' : 'text'}
        name={fieldName}
        value={formattedValue || ''}
        onChange={formik.handleChange}
        disabled={disabled}
        minLength={min}
        maxLength={max}
      />
    </FormControl>
  )
}
