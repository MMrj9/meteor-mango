import React from 'react'
import { useFormik } from 'formik'
import {
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Button,
  Flex,
  Icon,
  Text,
  Checkbox,
  Box,
  ButtonGroup,
  IconButton,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { AddIcon, ArrowBackIcon, DeleteIcon } from '@chakra-ui/icons'
import { CUIAutoComplete } from 'chakra-ui-autocomplete'
import _ from 'lodash'
import ObjectTabs from './Tabs'


export enum FormFieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  CHECKBOX = 'checkbox',
  AUTOCOMPLETE = 'autocomplete',
  ARRAY = 'array',
  OBJECT = 'object',
}

export enum ArrayFieldType {
  TEXT = 'text',
  OBJECT = 'object',
}

interface FormField {
  label: string
  type?: FormFieldType
  disabled?: boolean
  min?: number
  max?: number
  hideOnCreate?: boolean
  key?: string
  format?: (value: any) => any
  autocompleteOptions?: { value: string; label: string }[]
  autocompleteAllowNewOptions?: boolean
  autocompleteInitialValues?: any[]
  arrayType?: ArrayFieldType
  convertObject?: { labelKey: string, valueKey: string}
}

interface GenericFormProps<T> {
  initialValues: T
  onSubmit: (values: T) => void
  formFields: Record<string, FormField>
  collectionName: string
  hideSave?: boolean
}


const GenericForm = <T extends Record<string, any>>({
  initialValues,
  onSubmit,
  formFields,
  collectionName,
  hideSave,
}: GenericFormProps<T>) => {
  const formik = useFormik({
    initialValues,
    onSubmit,
    enableReinitialize: true,
  })

  const renderAutoCompleteField = (
    fieldName: string, fieldConfig: FormField
  ) => {
    let {
      label,
      autocompleteOptions,
      autocompleteAllowNewOptions = false,
      autocompleteInitialValues = []
    } = fieldConfig

    if (!autocompleteOptions) return

    return (
      <FormControl key={fieldName} mt={4}>
      {/* @ts-ignore */}
      <CUIAutoComplete
          label={label}
          placeholder={`Type ${label}`}
          disableCreateItem={!autocompleteAllowNewOptions}
          onCreateItem={(item) => {
            formik.setFieldValue(fieldName, [
              ...(formik.values[fieldName] || []),
              item,
            ])
          }}
          items={autocompleteOptions as any}
          selectedItems={
            formik.values[fieldName] || autocompleteInitialValues
          }
          onSelectedItemsChange={(changes) =>
            formik.setFieldValue(fieldName, changes.selectedItems)
          }
        />
    </FormControl>
    )
  }

  const renderTextAreaField = (
    fieldName: string, fieldConfig: FormField
  ) => {
    const {
      disabled,
      format,
      min, 
      max
    } = fieldConfig

    let fieldValue = _.get(formik.values, fieldName)
    const formattedValue = format ? format(fieldValue) : fieldValue

    return (
      <Textarea
      name={fieldName}
      value={formattedValue}
      onChange={formik.handleChange}
      disabled={disabled}
      minLength={min}
      maxLength={max}
    />
    )
  }

  const renderNumberField = (
    fieldName: string, fieldConfig: FormField
  ) => {
    const {
      disabled,
      format,
      min, 
      max
    } = fieldConfig

    let fieldValue = _.get(formik.values, fieldName)
    const formattedValue = format ? format(fieldValue) : fieldValue

    return (
      <Input
      type={FormFieldType.NUMBER}
      name={fieldName}
      value={formattedValue}
      onChange={formik.handleChange}
      disabled={disabled}
      min={min}
      max={max}
    />
    )
  }

  const renderCheckboxField = (
    fieldName: string, fieldConfig: FormField
  ) => {
    const {
      disabled,
      format,
      label, 
    } = fieldConfig

    let fieldValue = _.get(formik.values, fieldName)
    const formattedValue = format ? format(fieldValue) : fieldValue

    return (
      <Checkbox
      name={fieldName}
      isChecked={formattedValue}
      onChange={formik.handleChange}
      isDisabled={disabled}
      >
        {label}
      </Checkbox>
    )
  }

  const renderTextField = (
    fieldName: string, fieldConfig: FormField
  ) => {
    const {
      disabled,
      format,
      type,
      min,
      max
    } = fieldConfig

    let fieldValue = _.get(formik.values, fieldName)
    const formattedValue = format ? format(fieldValue) : fieldValue

    return (
      <Input
      type={type}
      name={fieldName}
      value={formattedValue}
      onChange={formik.handleChange}
      disabled={disabled}
      minLength={min}
      maxLength={max}
    />
    )
  }

  const renderList = (
    fieldName: string, fieldConfig: FormField
  ) => {
    const {
      arrayType,
      convertObject,
      label
    } = fieldConfig

    let fieldValue = _.get(formik.values, fieldName)
    let items = null
    if (fieldValue) {
      items = fieldValue.map((item: any, index: number) => {
        let field = null 
        if (arrayType && arrayType == ArrayFieldType.OBJECT && convertObject) {
          const valueKey = convertObject?.valueKey
          const subFieldCOnfig = {...fieldConfig, type: FormFieldType.OBJECT, label: ''}
          const subFieldName = `${fieldName}[${index}].${valueKey}`
          field = renderField(subFieldName, subFieldCOnfig)
        } else {
          const subFieldName = `${fieldName}[${index}]`
          const subFieldCOnfig = {...fieldConfig, type: FormFieldType.TEXT, label: ''}
          field = renderField(subFieldName, subFieldCOnfig) 
        }
        return (
          <Flex alignItems={'center'}>
            {field}
            <IconButton
              variant='outline'
              colorScheme='teal'
              aria-label='Call Sage'
              fontSize='20px'
              marginLeft={2}
              marginTop={4}
              icon={<DeleteIcon />}
              onClick={() => {
                fieldValue.splice(index, 1)
                formik.setFieldValue(fieldName, [...fieldValue])
              }}
            />
            </Flex>
        )
      })
    }

    return (
      <Box mt={4}>
        <Flex>
          <FormLabel flex={1}>{label}</FormLabel> 
          <ButtonGroup size='sm' isAttached variant='outline' onClick={() => {
            formik.setFieldValue(fieldName, [
              ...(formik.values[fieldName] || []),
              '',
            ])
          }}>
            <Button>Add</Button>
            <IconButton aria-label='Add' icon={<AddIcon />} />
          </ButtonGroup>
        </Flex>
        {items}
      </Box>
    )
  }

  const renderField = (fieldName: string, fieldConfig: FormField) => {
    let {
      type = FormFieldType.TEXT,
      label,
    } = fieldConfig
    console.log(fieldName, type, formik.values)

    let fieldValue = _.get(formik.values, fieldName)

    if (type === FormFieldType.AUTOCOMPLETE) {
      return renderAutoCompleteField(fieldName, fieldConfig)
    }
    
    if (type == FormFieldType.ARRAY) {
      return renderList(fieldName, fieldConfig)
    }

    if (type == FormFieldType.OBJECT) {
      console.log("fieldValue", fieldValue)
    }

    return (
      <FormControl key={fieldName} mt={4}>
        {label && <FormLabel>{label}</FormLabel>}
        {type === FormFieldType.TEXTAREA ? (
          renderTextAreaField(fieldName, fieldConfig)
        ) : type === FormFieldType.NUMBER ? (
          renderNumberField(fieldName, fieldConfig)
        ) : type === FormFieldType.CHECKBOX ? (
          renderCheckboxField(fieldName, fieldConfig)
        ) : (
          renderTextField(fieldName, fieldConfig)
        )}
      </FormControl>
    )
  }

  return (
    <Flex>
      <Box flex={1}>
        <form onSubmit={formik.handleSubmit}>
          {Object.entries(formFields).map(([fieldName, fieldConfig]) => {
            const { hideOnCreate, key } = fieldConfig
            if (!formik.values['_id'] && hideOnCreate) return null
            return renderField(key || fieldName, fieldConfig)
          })}

          <Flex mt={4} justifyContent={'flex-end'}>
            <Button
              colorScheme="gray"
              as={RouterLink}
              to={`/admin/${collectionName}`}
              size="sm"
              mr="1"
            >
              <Icon as={ArrowBackIcon} />
              <Text>Go Back</Text>
            </Button>
            {!hideSave && (
              <Button colorScheme="teal" type="submit" size="sm">
                <Flex align="center">
                  <Text>Save</Text>
                </Flex>
              </Button>
            )}
          </Flex>
        </form>
      </Box>
      {formik.values._id && (
        <ObjectTabs
          collectionName={collectionName}
          objectId={formik.values._id}
        />
      )}
    </Flex>
  )
}

export { FormField }
export default GenericForm
