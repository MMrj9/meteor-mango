import React from 'react'
import { Box, FormControl, FormLabel, Image, Input } from '@chakra-ui/react'
import { FormField } from '../types'
import _ from 'lodash'

/**
 * For demonstration, I'm including this placeholder.
 * In practice, you might keep `uploadImage` in a separate file.
 */
export async function uploadImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return a mock URL for demonstration
      resolve(URL.createObjectURL(file))
    }, 1500)
  })
}

/**
 * Render a single image field.
 */
export function renderImageField(
  fieldName: string,
  fieldConfig: FormField,
  formik: any,
) {
  const { label, disabled } = fieldConfig
  const imageUrl = _.get(formik.values, fieldName)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    const file = e.target.files && e.target.files[0]
    if (!file) return

    try {
      const uploadedUrl = await uploadImage(file)
      formik.setFieldValue(fieldName, uploadedUrl)
    } catch (err) {
      console.error('Image upload failed:', err)
    }
  }

  return (
    <FormControl key={fieldName} mt={4}>
      <FormLabel>{label}</FormLabel>
      {imageUrl && (
        <Box mb={2}>
          <Image src={imageUrl} alt="preview" maxH="200px" objectFit="cover" />
        </Box>
      )}
      <Input
        type="file"
        accept="image/*"
        disabled={disabled}
        onChange={handleImageChange}
      />
    </FormControl>
  )
}
