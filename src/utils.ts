import fs from 'fs'
/**
 * Determine if there's a File under the path
 * @param path The file-system path to a file or directory
 * @returns {boolean} Resolves with true if there's a File under the path
 */
export const isFile = (path: string): boolean => {
  return fs.lstatSync(path).isFile()
}

/**
 * Determine a Mime-Type of a File under the path
 * @param path The file-system path to a file or directory
 * @returns {string | null} Resolves with a MIME type valid in HTTP Headers Accept and ContentType
 */
export const getMimeType = async (path: string): Promise<string | null> => {
  const mime = (await import('mime')).default
  const contentType = mime.getType(path)

  return contentType
}
