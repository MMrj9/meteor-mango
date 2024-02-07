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
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { CUIAutoComplete } from 'chakra-ui-autocomplete'
import _ from 'lodash'
import ChangelogTable from './ChangeLog'
import ObjectTabs from './Tabs'

interface FormField {
  label: string
  type?: string
  disabled?: boolean
  min?: number
  max?: number
  hideOnCreate?: boolean
  key?: string
  format?: (value: any) => any
  autocompleteOptions?: { value: string; label: string }[]
  autocompleteAllowNewOptions?: boolean
  autocompleteInitialValues?: any[]
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

  const renderField = (fieldName: string, fieldConfig: FormField) => {
    const {
      type = 'text',
      label,
      disabled = false,
      min,
      max,
      format,
      autocompleteOptions,
      autocompleteAllowNewOptions = false,
      autocompleteInitialValues = [],
    } = fieldConfig

    const fieldValue = _.get(formik.values, fieldName)
    const formattedValue = format ? format(fieldValue) : fieldValue

    if (type === 'autocomplete' && autocompleteOptions) {
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
            items={autocompleteOptions}
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

    return (
      <FormControl key={fieldName} mt={4}>
        <FormLabel>{label}</FormLabel>
        {type === 'textarea' ? (
          <Textarea
            name={fieldName}
            value={formattedValue}
            onChange={formik.handleChange}
            disabled={disabled}
            minLength={min}
            maxLength={max}
          />
        ) : type === 'number' ? (
          <Input
            type="number"
            name={fieldName}
            value={formattedValue}
            onChange={formik.handleChange}
            disabled={disabled}
            min={min}
            max={max}
          />
        ) : type === 'checkbox' ? (
          <Checkbox
            name={fieldName}
            isChecked={formattedValue}
            onChange={formik.handleChange}
            isDisabled={disabled}
          >
            {label}
          </Checkbox>
        ) : (
          <Input
            type={type}
            name={fieldName}
            value={formattedValue}
            onChange={formik.handleChange}
            disabled={disabled}
            minLength={min}
            maxLength={max}
          />
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
              to={`/${collectionName}`}
              size="sm"
              mr="1"
            >
              <Icon as={ArrowBackIcon} />
              <Text>Go Back</Text>
            </Button>
            {hideSave && (
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
