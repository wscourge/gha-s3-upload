import * as core from '@actions/core'

import getInput from './input'
import getS3 from './s3'
import { isFile } from './utils'
import uploadDirectory from './upload-directory'
import uploadSingleFile from './upload-single-file'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const input = await getInput()
    const s3 = await getS3(input)

    if (isFile(input.source)) {
      await uploadSingleFile({
        s3,
        input,
        source: input.source,
        destination: input.destination
      })
    } else {
      await uploadDirectory({ s3, input })
    }

    // TODO: Set outputs for other workflow steps to use
    // core.setOutput('key', value)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
