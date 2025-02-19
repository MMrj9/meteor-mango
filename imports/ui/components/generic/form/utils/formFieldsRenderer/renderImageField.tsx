import React from 'react'
import { Box, FormControl, FormLabel, Image, Input } from '@chakra-ui/react'
import { FormField } from '../types'
import _ from 'lodash'
import { Meteor } from 'meteor/meteor'
import { PresignedUrlResponse } from '/server/utils/images'

export async function uploadImage(file: File): Promise<string> {
  try {
    // Step 1: Get pre-signed URL
    const { url, filePath }: PresignedUrlResponse = await new Promise(
      (resolve, reject) => {
        Meteor.call(
          'upload.getPresignedUrl',
          file.name,
          file.type,
          (err: Meteor.Error, res: PresignedUrlResponse) => {
            if (err) reject(err)
            else resolve(res)
          },
        )
      },
    )

    // Step 2: Upload file directly to MinIO
    await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })

    // Step 3: Return MinIO file path (can be used to retrieve the image)
    return `${Meteor.settings.public.minio.publicUrl}/${filePath}`
  } catch (error) {
    console.error('Image upload failed:', error)
    throw error
  }
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
