# S3 Upload Github Action

A cross-platform (Node.js-based) Github Action to upload files and/or
directories to S3-compatible storage providers.

## Usage

All of the following are to be added to your _.github/workflows/workflow.yml_.

### Single file upload

The following will upload a single _file.txt_ file from
_/tmp/path/to/dir/file.txt_ absolute path and save it as a
_path/on/s3/file.txt_:

```yaml
name: Test Run
on: push
jobs:
  lambda:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: prepare a single file
        run: |
          mkdir -p /tmp/path/to/dir
          echo "Inside /tmp/path/to/dir/file.txt" >> /tmp/path/to/dir/file.txt
      - uses: wscourge/gha-s3-upload@main
        with:
          source: '/tmp/path/to/dir/file.txt'
          destination: 'path/on/s3'
          region: ${{ vars.S3_REGION }}
          bucket: 'my-bucket'
          endpoint: ${{ vars.S3_ENDPOINT }}
          access_key_id: ${{ secrets.S3_ACCESS_KEY_ID }}
          secret_access_key: ${{ secrets.S3_SECRET_ACCESS_KEY }}
```

### Recursive directory upload

The following will upload all 4 files from _/tmp/path_ absolute path and save
them with a _path/on/s3/_ prefix:

```yaml
name: Test Run
on: push
jobs:
  lambda:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: prepare directiories
        run: |
          mkdir -p /tmp/path/to/nested/dir
          echo "Inside /tmp/path/file.txt" >> /tmp/path/file.txt
          echo "Inside /tmp/path/to/file.txt" >> /tmp/path/to/file.txt
          echo "Inside /tmp/path/to/nested/file.txt" >> /tmp/path/to/nested/file.txt
          echo "Inside /tmp/path/to/nested/dir/file.txt" >> /tmp/path/to/nested/dir/file.txt
      - uses: wscourge/gha-s3-upload@main
        with:
          source: '/tmp/path'
          destination: 'path/on/s3'
          region: ${{ vars.S3_REGION }}
          bucket: 'my-bucket'
          endpoint: ${{ vars.S3_ENDPOINT }}
          access_key_id: ${{ secrets.S3_ACCESS_KEY_ID }}
          secret_access_key: ${{ secrets.S3_SECRET_ACCESS_KEY }}
```

## Action inputs

Sensitive information, especially `key_id` and `secret_access_key`, should be
[set as encrypted secrets](https://help.github.com/en/articles/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables)
— otherwise, they'll be public to anyone browsing your repository's source code.

| variable            | required | description                                                                                                               | default       |
| ------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `access_key_id`     | yes      | Your S3 Access Key. [More info here.](https://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html)        |               |
| `secret_access_key` | yes      | Your S3 Secret Access Key. [More info here.](https://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html) |               |
| `bucket`            | yes      | The name of the S3 bucket.                                                                                                |               |
| `region`            | yes      | The name of the S3 region.                                                                                                | `"us-east-1"` |
| `source`            | yes      | The local directory or file you wish to upload to S3.                                                                     |               |
| `destination`       | yes      | The destination directory in S3.                                                                                          |               |
| `endpoint`          | no       | The endpoint URI to send requests to. [More info here.](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html)  |               |

---

<!-- | `acl`                   | no       | S3 access control lists (ACL). [More info here.](https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html#canned-acl) | `"private"`   | -->
<!-- | `cache_control`         | no       | The Cache-Control general-header. [More info here.](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9)             |               | -->

Notes:

- Set `destination` to an empty string `""` to upload to S3's root directory.
- Set `destination` to a file name, e.g.: `"me.json"` (or `"path/to/me.json"`)
  to rename a single file that is being uploaded.
- **Do not set the following backslash** at the end of `source` and
  `destination` directory names.

<!-- ## Action outputs -->

<!-- **TODO:** `s3_response` with an array of `$metadata` and `Location` response
body fields for each uploaded file. -->

<!-- | name               | description                                                                             |
| ------------------ | --------------------------------------------------------------------------------------- |
| `s3_response`      | `$metadata` and `Location` response body fields                                         | -->

## Development

### Initial Setup

After you've cloned the repository to your local machine or codespace, you'll
need to perform some initial setup steps before you can develop your action.

> [!NOTE]
>
> You'll need to have a reasonably modern version of
> [Node.js](https://nodejs.org) handy (20.x or later should work!). If you are
> using a version manager like [`nodenv`](https://github.com/nodenv/nodenv) or
> [`nvm`](https://github.com/nvm-sh/nvm), this template has a `.node-version`
> file at the root of the repository that will be used to automatically switch
> to the correct version when you `cd` into the repository. Additionally, this
> `.node-version` file is used by GitHub Actions in any `actions/setup-node`
> actions.

1. :hammer_and_wrench: Install the dependencies

   ```bash
   npm install
   ```

1. :building_construction: Package the TypeScript for distribution

   ```bash
   npm run bundle
   ```

1. :white_check_mark: Run the tests

   ```bash
   $ npm test

   PASS  ./index.test.js
     ✓ throws invalid number (3ms)
     ✓ wait 500 ms (504ms)
     ✓ test runs (95ms)

   ...
   ```
