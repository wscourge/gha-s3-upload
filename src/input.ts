import * as core from '@actions/core'
import fs from 'fs'

/**
 * Gathers and validates action's input
 * @returns {Promise<Input>} Resolves with action's input
 */

export type ActionInput = {
  source: string
  destination: string
  accessKeyId: string
  secretAccessKey: string
  region: string
  bucket: string
  endpoint: string | undefined
  cacheControl: string | undefined
  acl: string | undefined
}

export async function input(): Promise<ActionInput> {
  const source = core.getInput('source')
  const destination = core.getInput('destination')
  const accessKeyId = core.getInput('access_key_id')
  const secretAccessKey = core.getInput('secret_access_key')
  const region = core.getInput('region')
  const bucket = core.getInput('bucket')
  const endpoint = core.getInput('endpoint')
  const cacheControl = core.getInput('cache_control')
  const acl = core.getInput('acl')

  const sourceExist = fs.existsSync(source)
  if (!sourceExist) {
    throw new Error(`Source "${source}" file/directory does not exist`)
  }

  return {
    source,
    destination,
    accessKeyId,
    secretAccessKey,
    region,
    bucket,
    endpoint,
    cacheControl,
    acl
  }
}

export default input
