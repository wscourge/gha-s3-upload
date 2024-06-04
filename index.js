// useful:
// - https://www.freecodecamp.org/news/how-to-upload-files-to-aws-s3-with-node/
// - https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions
// - https://github.com/stcalica/s3-upload/tree/master
// - https://www.howtogeek.com/devops/how-to-upload-to-amazon-s3-from-github-actions/

import core from "@actions/core"
// import github from "@actions/github"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
// import { Upload } from "@aws-sdk/lib-storage"
import fs from "fs"
import { chunk } from "lodash"
import mime from "mime"
// import path from "path"
import readdir from "recursive-readdir"

const source = core.getInput("source")
const destination = core.getInput("destination")
const accessKeyId = core.getInput("access_key_id")
const secretAccessKey = core.getInput("secret_access_key")
const region = core.getInput("region")
const bucket = core.getInput("bucket")
const endpoint = core.getInput("endpoint")
const cacheControl = core.getInput("cache_control")
const acl = core.getInput("acl")

const client = new S3Client({
  forcePathStyle: true,
  credentials: { accessKeyId, secretAccessKey },
  region,
  ...endpoint && { endpoint },
})

const upload = async ({ source, destination }) => {
  // const result = await new Upload({
  //   client,
  //   params: {
  //     ACL: acl,
  //     Bucket: bucket,
  //     Key: destination,
  //     Body: fs.readFileSync(source),
  //   }
  // }).done()
  const contentType = mime.getType(source)
  // up to 50MB / 5GB?
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: destination,
    Body: fs.readFileSync(source),
    ...acl && { ACL: acl },
    ...cacheControl && { CacheControl: cacheControl },
    ...contentType && { ContentType: contentType },
  })
  const result = await client.send(command)

  return result
}

const main = async () => {
  try {
    const sourceExist = fs.existsSync(source)
    if (!sourceExist) return core.setFailed(`Source "${source}" file/directory does not exist`);

    if (fs.lstatSync(source).isFile()) {
      // upload a single file
      console.info("Uploading a single file.\nSource:", source, "\nDestination:", destination)
      const result = await upload({ source, destination })
      console.info("npm @aws-sdk/lib-storage: new Upload({ ... }).done() response", result)
    } else {
      // upload directories recursively
      const files = await readdir(source)
      const uploads = files.map(absolutePath => {
        const relativePath = absolutePath
          .replace(source, "") // absolute path directory prefix
          .replaceAll("\\", "/") // windows \ paths
          .replace(/^\//, "") // root slash

        return upload({
          source: absolutePath,
          destination: `${destination}/${relativePath}`,
        })
      })
      console.info(`Uploading ${uploads.length} files.`)
      const chunks = chunk(uploads, 4)
      while (chunks.length) {
        const batch = chunks.pop()
        const result = await Promise.all(batch)
        console.info(`Batch ${chunks.length} result:`, result)
        await new Promise((resolve) => setTimeout(resolve, 3000))
      }
    }
  } catch (error) {
   core.setFailed(error.message);
  }
}

main()
