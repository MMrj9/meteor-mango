import React from 'react'
import { FormControl, FormLabel, Select } from '@chakra-ui/react'
import { FormField } from '../types'
import _ from 'lodash'

/**
 * Render a select field.
 */
export function renderSelectField(
  fieldName: string,
  fieldConfig: FormField,
  formik: any,
) {
  const { disabled, options = [], format, label } = fieldConfig
  const fieldValue = _.get(formik.values, fieldName)
  const formattedValue = format ? format(fieldValue) : fieldValue

  return (
    <FormControl key={fieldName} px={2} py={4}>
      {label && <FormLabel>{label}</FormLabel>}
      <Select
        name={fieldName}
        value={formattedValue || ''}
        onChange={formik.handleChange}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </FormControl>
  )
}
