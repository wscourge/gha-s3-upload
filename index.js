// useful:
// - https://www.freecodecamp.org/news/how-to-upload-files-to-aws-s3-with-node/
// - https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions
// - https://github.com/stcalica/s3-upload/tree/master
// - https://www.howtogeek.com/devops/how-to-upload-to-amazon-s3-from-github-actions/

const core = require("@actions/core")
// const github = require("@actions/github")
const { S3Client } = require("@aws-sdk/client-s3")
const { Upload } = require("@aws-sdk/lib-storage")
const fs = require("fs")
// const path = require("path")
const readdir = require("recursive-readdir")

const source = core.getInput("source")
const destination = core.getInput("destination")
const accessKeyId = core.getInput("access_key_id")
const secretAccessKey = core.getInput("secret_access_key")
const region = core.getInput("region")
const bucket = core.getInput("bucket")
const endpoint = core.getInput("endpoint")
const acl = core.getInput("acl")

const client = new S3Client({
  forcePathStyle: true,
  credentials: { accessKeyId, secretAccessKey },
  region,
  ...endpoint && { endpoint },
})

const upload = async ({ pathname, destination, acl }) => {
  const result = await new Upload({
    client,
    params: {
      ACL: acl,
      Bucket: bucket,
      Key: destination,
      Body: fs.readFileSync(pathname),
    }
  }).done()

  return result
}

const main = async () => {
  try {
    const sourceExist = fs.existsSync(source)
    if (!sourceExist) return core.setFailed(`Source "${source}" file/directory does not exist`);

    if (fs.lstatSync(source).isFile()) {
      // upload a single file
      const result = await upload({ pathname: source, destination, acl })
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
          pathname: absolutePath,
          destination: `${destination}/${relativePath}`,
          acl
        })
      })
      const result = await Promise.all(uploads)
      console.info("npm @aws-sdk/lib-storage: [new Upload({ ... }).done(), ...] response", result)
    }
  } catch (error) {
   core.setFailed(error.message);
  }
}

main()
