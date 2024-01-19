// GenericForm.tsx
import React from 'react'
import { useFormik } from 'formik'
import {
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Button,
  Checkbox,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { ArrowBackIcon } from '@chakra-ui/icons'

interface GenericFormProps<T> {
  initialValues: T
  onSubmit: (values: T) => void
  formFields: Record<
    string,
    { label: string; type?: string; disabled?: boolean; maxCharacters?: number }
  >
  collectionName: string
}

const GenericForm = <T extends Record<string, any>>({
  initialValues,
  onSubmit,
  formFields,
  collectionName,
}: GenericFormProps<T>) => {
  const formik = useFormik({
    initialValues,
    onSubmit,
    enableReinitialize: true,
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      {Object.entries(formFields).map(([fieldName, fieldConfig]) => {
        const {
          type = 'text',
          label,
          disabled = false,
          maxCharacters,
        } = fieldConfig

        return (
          <FormControl key={fieldName}>
            <FormLabel>{label}</FormLabel>
            {type === 'textarea' ? (
              <Textarea
                name={fieldName}
                value={formik.values[fieldName]}
                onChange={formik.handleChange}
                disabled={disabled}
                maxLength={maxCharacters}
              />
            ) : type === 'number' ? (
              <Input
                type="number"
                name={fieldName}
                value={formik.values[fieldName]}
                onChange={formik.handleChange}
                disabled={disabled}
                maxLength={maxCharacters}
              />
            ) : type === 'checkbox' ? (
              <Checkbox
                name={fieldName}
                isChecked={formik.values[fieldName]}
                onChange={formik.handleChange}
                isDisabled={disabled}
              >
                {label}
              </Checkbox>
            ) : (
              <Input
                type={type}
                name={fieldName}
                value={formik.values[fieldName]}
                onChange={formik.handleChange}
                disabled={disabled}
                maxLength={maxCharacters}
              />
            )}
          </FormControl>
        )
      })}

      <Flex mt={4}>
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
        <Button colorScheme="teal" type="submit" size="sm">
          <Flex align="center">
            <Text>Add</Text>
          </Flex>
        </Button>
      </Flex>
    </form>
  )
}

export default GenericForm
