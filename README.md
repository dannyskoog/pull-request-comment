# Pull Request Comment

A GitHub action for posting comments in pull requests

## Usage

### Basic

Always post a **new** comment.

```yml
on: pull_request

jobs:
  new_comment:
    runs-on: ubuntu-latest
    steps:
      - uses: dannyskoog/pull-request-comment@v1
        with:
          message: This is a new comment
```

### Upsert comment

Use the `marker` input to **update** an existing comment. If not found - a **new** comment will be posted.

```yml
on: pull_request

jobs:
  upsert_comment:
    runs-on: ubuntu-latest
    steps:
      - uses: dannyskoog/pull-request-comment@v1
        with:
          message: This is a new comment
          marker: <!-- some-unique-text -->
      - run: sleep 5s
        shell: bash
      - uses: dannyskoog/pull-request-comment@v1
        with:
          message: This comment was updated
          marker: <!-- some-unique-text -->
```

## Inputs 

| Name | Description | Required | Default |
| --- | --- | --- | --- |
| `message` | Body of the comment | ✅ | |
| `marker` | Hidden text to look for in existing comments | | |
| `token` | GitHub access token to use when posting the comment | | ${{ github.token }} |

## Contributing

### Build

The build steps transpiles the `src/main.ts` to `dist/index.js` which is used in a NodeJS environment.
It is handled by `vercel/ncc` compiler.

```sh
$ npm run build
```
