import React from 'react'
import { FormControl } from '@chakra-ui/react'
import { FormField, FormOption } from '../types'

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
        selectedItems={formik.values[fieldName] || optionsInitialValues}
        onSelectedItemsChange={(changes: any) =>
          formik.setFieldValue(fieldName, changes.selectedItems)
        }
      />
    </FormControl>
  )
}
