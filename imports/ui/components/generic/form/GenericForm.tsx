import React from 'react'
import { useFormik } from 'formik'
import { Button, Flex, Icon, Text, Box, ButtonGroup } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { ArrowBackIcon } from '@chakra-ui/icons'
import ObjectTabs from './Tabs'
import { FormField } from './utils/types'
import { renderField } from './utils/formFieldsRenderer/renderer'

interface GenericFormProps<T> {
  initialValues: T
  onSubmit: (values: T, redirect: boolean) => void
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
    onSubmit: (values) => onSubmit(values, true),
    enableReinitialize: true,
  })

  const isCreate = !formik.values['_id']

  const handleSaveAndContinueEditing = async (event: React.MouseEvent) => {
    event.preventDefault()
    await formik.validateForm()
    if (!formik.isValid) return
    onSubmit(formik.values, false)
  }

  const handleSaveAndNavigate = async (event: React.MouseEvent) => {
    event.preventDefault()
    await formik.handleSubmit()
  }
  
  return (
    <Flex>
      <Box flex={1}>
        <form onSubmit={formik.handleSubmit}>
          {Object.entries(formFields).map(([fieldName, fieldConfig]) => {
            const { hideOnCreate, key } = fieldConfig
            if (isCreate && hideOnCreate) return null
            const actualFieldName = key || fieldName
            return (
              <React.Fragment key={actualFieldName}>
                {renderField(actualFieldName, fieldConfig, formik)}
              </React.Fragment>
            )
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
              <Text ml={1}>Go Back</Text>
            </Button>
            {!hideSave && (
              <ButtonGroup>
                {!isCreate && (
                  <Button
                    colorScheme="teal"
                    size="sm"
                    onClick={handleSaveAndContinueEditing}
                  >
                    <Flex align="center">
                      <Text>Save and Continue Editing</Text>
                    </Flex>
                  </Button>
                )}
                <Button
                  colorScheme="teal"
                  size="sm"
                  onClick={handleSaveAndNavigate}
                >
                  <Flex align="center">
                    <Text>Save</Text>
                  </Flex>
                </Button>
              </ButtonGroup>
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

export default GenericForm
