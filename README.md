# VidJutsu CLI

Command-line client for the public VidJutsu API. The released executable is standalone; Node.js, Bun, and TypeScript are not required to install or run it.

## Install and authenticate

```sh
curl -fsSL https://vidjutsu.ai/install.sh | sh
vidjutsu auth --key vj_your_api_key
```

The CLI targets `https://api.vidjutsu.ai` by default.

## Supported commands

- `watch`, `extract`, `transcribe`, and `overlay` for video intelligence and media processing
- `upload` for local files or remote URLs
- `account`, `post`, `asset`, and `reference` resource management
- `check` for VidLang validation and saved rules
- `clone` for cloneability checks, persisted characters, starting frames, Kling video generation, status, and the complete TikTok workflow
- `usage`, `info`, `subscribe`, `auth`, `status`, `version`, and `update`

Run `vidjutsu <command> --help` for arguments.

## Kling cloning

Kling is the only supported clone-video model. A full run requires an existing character ID and performs TikTok import, cloneability analysis, first-frame extraction, identity replacement, and Kling submission:

```sh
vidjutsu clone character create --prompt "Photoreal chef in their thirties"

vidjutsu clone run \
  --tiktok "https://www.tiktok.com/@creator/video/123" \
  --character char_123 \
  --prompt "Preserve pose, framing, lighting, and background"

vidjutsu clone status clone_123
```

The explicit workflow is also available through `clone check`, `clone starting-image`, and `clone video`.

## Development and release

```sh
bun install --frozen-lockfile
bun run check
```

`bun run check` enforces that `package.json` and `src/version.ts` have the same version, runs tests, and builds the CLI. Releases are created from `v*` tags after that invariant passes in GitHub Actions.
