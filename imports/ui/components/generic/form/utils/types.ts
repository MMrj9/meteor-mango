export enum FormFieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  CHECKBOX = 'checkbox',
  AUTOCOMPLETE = 'autocomplete',
  ARRAY = 'array',
  OBJECT = 'object',
  SELECT = 'select',
  IMAGE = 'image',
}

export enum ArrayFieldType {
  TEXT = 'text',
  OBJECT = 'object',
  IMAGE = 'image',
}

export interface FormOption {
  value: string | number
  label: string | number
}

export interface FormField {
  label: string
  type?: FormFieldType
  disabled?: boolean
  min?: number
  max?: number
  hideOnCreate?: boolean
  key?: string
  format?: (value: any) => any
  options?: FormOption[]
  optionsAllowNewOptions?: boolean
  optionsInitialValues?: any[]
  arrayType?: ArrayFieldType
  objectFields?: Record<string, FormField>
}

export interface GenericFormProps<T> {
  initialValues: T
  onSubmit: (values: T, redirect: boolean) => void
  formFields: Record<string, FormField>
  collectionName: string
  hideSave?: boolean
}
