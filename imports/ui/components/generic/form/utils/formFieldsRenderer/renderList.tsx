import React from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Image,
  Input,
} from '@chakra-ui/react'
import { ArrayFieldType, FormField, FormFieldType } from '../types'
import { renderField } from './renderer'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { uploadImage } from './renderImageField'
import _ from 'lodash'

/**
 * Render an array field (list).
 * If arrayType === IMAGE, it's an array of images; if TEXT, array of strings; if OBJECT, array of nested objects, etc.
 */
export function renderList(
  fieldName: string,
  fieldConfig: FormField,
  formik: any,
) {
  const { arrayType, label, objectFields } = fieldConfig
  const fieldValue: any[] = _.get(formik.values, fieldName) || []

  const items = fieldValue.map((item: any, index: number) => {
    if (arrayType === ArrayFieldType.OBJECT && objectFields) {
      // Array of objects
      return (
        <Flex
          key={index}
          mb={4}
          border="1px solid #eee"
          p={2}
          borderRadius="md"
        >
          <Flex flex={1}>
            {Object.entries(objectFields).map(
              ([subFieldName, subFieldConfig]) => {
                const fullFieldName = `${fieldName}[${index}].${subFieldName}`
                return renderField(fullFieldName, subFieldConfig, formik)
              },
            )}
          </Flex>
          <IconButton
            variant="outline"
            colorScheme="red"
            aria-label="Remove"
            fontSize="16px"
            size="sm"
            mt={2}
            icon={<DeleteIcon />}
            onClick={() => {
              fieldValue.splice(index, 1)
              formik.setFieldValue(fieldName, [...fieldValue])
            }}
          />
        </Flex>
      )
    } else if (arrayType === ArrayFieldType.IMAGE) {
      // Array of image URLs
      const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
      ) => {
        const file = e.target.files && e.target.files[0]
        if (!file) return
        try {
          const uploadedUrl = await uploadImage(file)
          fieldValue[index] = uploadedUrl
          formik.setFieldValue(fieldName, [...fieldValue])
        } catch (err) {
          console.error('Image upload failed:', err)
        }
      }

      return (
        <Flex key={index} mb={4}>
          {item ? (
            <Image
              src={item}
              alt={`preview-${index}`}
              maxH="150px"
              objectFit="cover"
              mb={2}
            />
          ) : (
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          )}
          <IconButton
            variant="outline"
            colorScheme="red"
            aria-label="Remove"
            fontSize="16px"
            size="sm"
            ml={2}
            icon={<DeleteIcon />}
            onClick={() => {
              fieldValue.splice(index, 1)
              formik.setFieldValue(fieldName, [...fieldValue])
            }}
          />
        </Flex>
      )
    } else {
      // Array of text or fallback
      const subFieldName = `${fieldName}[${index}]`
      const subFieldConfig = {
        ...fieldConfig,
        type: FormFieldType.TEXT,
        label: '',
      }

      return (
        <Flex alignItems="center" key={index}>
          <Flex flex={1}>
            {renderField(subFieldName, subFieldConfig, formik)}
          </Flex>
          <IconButton
            variant="outline"
            colorScheme="red"
            aria-label="Remove"
            fontSize="16px"
            size="sm"
            icon={<DeleteIcon />}
            onClick={() => {
              fieldValue.splice(index, 1)
              formik.setFieldValue(fieldName, [...fieldValue])
            }}
          />
        </Flex>
      )
    }
  })

  return (
    <FormControl key={fieldName} px={2} py={4}>
      <Flex>
        <FormLabel flex={1}>{label}</FormLabel>
        <ButtonGroup
          size="sm"
          isAttached
          variant="outline"
          onClick={() => {
            let newItem: any = ''
            if (arrayType === ArrayFieldType.OBJECT) {
              newItem = {}
            } else if (arrayType === ArrayFieldType.IMAGE) {
              newItem = ''
            }
            fieldValue.push(newItem)
            formik.setFieldValue(fieldName, [...fieldValue])
          }}
        >
          <Button>Add</Button>
          <IconButton aria-label="Add" icon={<AddIcon />} />
        </ButtonGroup>
      </Flex>
      <Box mt={2}>{items}</Box>
    </FormControl>
  )
}
