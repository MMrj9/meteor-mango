import { FormControl, FormLabel, Textarea } from '@chakra-ui/react'
import React from 'react'
import { FormField } from '../types'
import _ from 'lodash'

/**
 * Render a text area field.
 */
export function renderTextAreaField(
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
      <Textarea
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
