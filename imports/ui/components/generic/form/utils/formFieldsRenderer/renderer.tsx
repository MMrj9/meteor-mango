import React from 'react'
import _ from 'lodash'
import { FormField, FormFieldType } from '../types'
import { renderTextField } from './renderTextField'
import { renderTextAreaField } from './renderTextAreaField'
import { renderAutoCompleteField } from './renderAutoCompleteField'
import { renderList } from './renderList'
import { renderNumberField } from './renderNumberField'
import { renderCheckboxField } from './renderCheckboxField'
import { renderSelectField } from './renderSelectFields'
import { renderImageField } from './renderImageField'
import { renderDateField } from './renderDateField'

/**
 * A central function that chooses which specific render function to call.
 */
export function renderField(
  fieldName: string,
  fieldConfig: FormField,
  formik: any,
): React.ReactNode {
  const { type = FormFieldType.TEXT } = fieldConfig

  switch (type) {
    case FormFieldType.AUTOCOMPLETE:
      return renderAutoCompleteField(fieldName, fieldConfig, formik)
    case FormFieldType.AUTOCOMPLETE_ARRAY:
      return renderAutoCompleteField(fieldName, fieldConfig, formik)
    case FormFieldType.ARRAY:
      return renderList(fieldName, fieldConfig, formik)
    case FormFieldType.TEXTAREA:
      return renderTextAreaField(fieldName, fieldConfig, formik)
    case FormFieldType.NUMBER:
      return renderNumberField(fieldName, fieldConfig, formik)
    case FormFieldType.CHECKBOX:
      return renderCheckboxField(fieldName, fieldConfig, formik)
    case FormFieldType.SELECT:
      return renderSelectField(fieldName, fieldConfig, formik)
    case FormFieldType.IMAGE:
      return renderImageField(fieldName, fieldConfig, formik)
    case FormFieldType.DATE:
      return renderDateField(fieldName, fieldConfig, formik)
    default:
      return renderTextField(fieldName, fieldConfig, formik)
  }
}
