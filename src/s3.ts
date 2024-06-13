import { S3Client } from '@aws-sdk/client-s3'
import { ActionInput } from './input'

export async function s3({
  accessKeyId,
  secretAccessKey,
  region,
  endpoint
}: ActionInput): Promise<S3Client> {
  const client = new S3Client({
    forcePathStyle: true,
    credentials: {
      accessKeyId,
      secretAccessKey
    },
    region,
    ...(endpoint && { endpoint })
  })

  return client
}

export default s3
