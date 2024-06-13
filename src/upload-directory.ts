import { S3Client } from '@aws-sdk/client-s3'
import readdir from 'recursive-readdir'
import { ActionInput } from './input'
import uploadSingleFile, { UploadResult } from './upload-single-file'

export async function uploadDirectory({
  s3,
  input
}: {
  input: ActionInput
  s3: S3Client
}): Promise<UploadResult[]> {
  const files = await readdir(input.source)
  const uploads = files.map(async (absolutePath: string) => {
    const relativePath = absolutePath
      // removes absolute path directory prefix
      .replace(input.source, '')
      // replaces windows "\" paths
      .replaceAll('\\', '/')
      // removes root slash
      .replace(/^\//, '')

    return uploadSingleFile({
      s3,
      input,
      source: absolutePath,
      destination: `${input.destination}/${relativePath}`
    })
  })
  return await Promise.all(uploads)
}

export default uploadDirectory
