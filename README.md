# S3 Upload Github Action

A cross-platform (Node.js-based) Github Action to upload files and/or directories to S3-compatible storage providers.

## Usage

All of the following are to be added to your _.github/workflows/workflow.yml_.

### Single file upload

The following will upload a single _file.txt_ file from _/tmp/path/to/dir/file.txt_ absolute path
and save it as a _path/on/s3/file.txt_:

```yaml
name: Test Run
on:
  push
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
          source: "/tmp/path/to/dir/file.txt"
          destination: "path/on/s3"
          region: ${{ vars.S3_ENDPOINT }}
          bucket: "my-bucket"
          endpoint: ${{ vars.S3_ENDPOINT }}
          access_key_id: ${{ secrets.S3_ACCESS_KEY_ID }}
          secret_access_key: ${{ secrets.S3_SECRET_ACCESS_KEY }}
```


### Recursive directory upload

The following will upload all 4 files:

```yaml
name: Test Run
on:
  push
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
          source: "/tmp/path"
          destination: "path/on/s3"
          region: "us-east-1"
          bucket: "my-bucket"
          endpoint: ${{ vars.S3_ENDPOINT }}
          access_key_id: ${{ secrets.S3_ACCESS_KEY_ID }}
          secret_access_key: ${{ secrets.S3_SECRET_ACCESS_KEY }}
```

## API:

1. 
