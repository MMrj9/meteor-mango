import React from 'react'
import { FormControl } from '@chakra-ui/react'
import { FormField, FormOption } from '../types'
import { CUIAutoComplete } from 'chakra-ui-autocomplete'

/**
 * Render an autocomplete field.
 * (Using CUIAutoComplete from chakra-ui-autocomplete)
 */
export function renderAutoCompleteField(
  fieldName: string,
  fieldConfig: FormField,
  formik: any,
) {
  const {
    label,
    options,
    optionsAllowNewOptions = false,
    optionsInitialValues = [],
  } = fieldConfig

  if (!options) return null

  const selectedItems = formik.values[fieldName].map((item: string) => ({
    value: item,
    label: item
  })) || optionsInitialValues
  return (
    <FormControl key={fieldName} mt={4}>
      {/* @ts-ignore */}
      <CUIAutoComplete
        label={label}
        placeholder={`Type ${label}`}
        disableCreateItem={!optionsAllowNewOptions}
        onCreateItem={(item: FormOption) => {
          formik.setFieldValue(fieldName, [
            ...(formik.values[fieldName] || []),
            item,
          ])
        }}
        items={options as any}
        selectedItems={selectedItems || optionsInitialValues}
        onSelectedItemsChange={(changes: any) =>
          formik.setFieldValue(fieldName, changes.selectedItems)
        }
      />
    </FormControl>
  )
}
