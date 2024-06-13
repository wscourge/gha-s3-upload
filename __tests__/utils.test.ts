/**
 * Unit tests for src/utils.ts
 */

import { isFile, getMimeType } from '../src/utils'
import { expect } from '@jest/globals'

const DATA_ROOT = `${process.cwd()}/__tests__/data`

describe('isFile(path)', () => {
  it('throws an invalid pathname', async () => {
    const path = `${DATA_ROOT}/does/not/exist.php`

    expect(() => isFile(path)).toThrow(
      `ENOENT: no such file or directory, lstat '${path}'`
    )
  })

  it('returns false given an existing directory path', async () => {
    const path = `${DATA_ROOT}/nested`

    expect(isFile(path)).toBe(false)
  })

  it('returns true given an existing file path', async () => {
    const path = `${DATA_ROOT}/nested/file.txt`

    expect(isFile(path)).toBe(true)
  })
})

describe('getMimeType(path)', () => {
  it('returns mime type based on file extension', async () => {
    const path = `${DATA_ROOT}/does/not/exist.json`

    expect(await getMimeType(path)).toBe('application/json')
  })
})
