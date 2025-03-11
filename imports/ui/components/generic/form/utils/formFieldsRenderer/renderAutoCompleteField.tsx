import React from 'react';
import { FormControl } from '@chakra-ui/react';
import { FormField, FormFieldType, FormOption } from '../types';
import { CUIAutoComplete } from 'chakra-ui-autocomplete';

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
  } = fieldConfig;

  if (!options) return null;

  const isArray = fieldConfig.type === FormFieldType.AUTOCOMPLETE_ARRAY
  const selectedItems = isArray
    ? formik.values[fieldName].map((item: string) => ({
        value: item,
        label: item,
      })) || optionsInitialValues
    : formik.values[fieldName] ? [{ value: formik.values[fieldName], label: formik.values[fieldName] }] : [];

  return (
    <FormControl key={fieldName} mt={4}>
      {/* @ts-ignore */}
      <CUIAutoComplete
        label={label}
        placeholder={`Type ${label}`}
        disableCreateItem={!optionsAllowNewOptions}
        onCreateItem={(item: FormOption) => {
          if (isArray) {
            formik.setFieldValue(fieldName, [
              ...(formik.values[fieldName] || []),
              item.value,
            ]);
          } else {
            formik.setFieldValue(fieldName, item.value);
          }
        }}
        items={options as any}
        selectedItems={selectedItems}
        onSelectedItemsChange={(changes: any) => {
          if (isArray) {
            formik.setFieldValue(
              fieldName,
              changes.selectedItems.map((item: FormOption) => item.value),
            );
          } else {
            formik.setFieldValue(fieldName, changes.selectedItems[0]?.value || '');
          }
        }}
      />
    </FormControl>
  );
}
