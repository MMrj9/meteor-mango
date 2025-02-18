import AWS from 'aws-sdk'
import { Meteor } from 'meteor/meteor'


// Configure MinIO
const minioClient = new AWS.S3({
    endpoint: Meteor.settings.private.minio.endpoint,
    accessKeyId: Meteor.settings.private.minio.accessKey,
    secretAccessKey: Meteor.settings.private.minio.secretKey,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
  })
  

export interface PresignedUrlResponse {
  url: string
  filePath: string
}


// Function to generate a pre-signed upload URL
Meteor.methods({
  async 'upload.getPresignedUrl'(
    fileName: string,
    fileType: string,
  ): Promise<PresignedUrlResponse> {
    const params = {
      Bucket: Meteor.settings.private.minio.bucket, 
      Key: `${Meteor.settings.private.minio.bucket}/${Date.now()}-${fileName}`,
      ContentType: fileType,
      Expires: 300, // 5 minutes
    }

    const signedUrl: string = await minioClient.getSignedUrlPromise(
      'putObject',
      params,
    )
    return { url: signedUrl, filePath: params.Key }
  },
})
