## Git Workflow

**NEVER push directly to main.** All changes must go through a pull request:

1. Create a feature branch: `git checkout -b feature/description`
2. Commit changes to the feature branch
3. Push the branch: `git push origin feature/description`
4. Create a PR: `gh pr create`
5. Merge after CI passes

## Releases

Releases are triggered by pushing a `v*` tag to main. The GitHub Actions workflow builds standalone Bun binaries for all platforms and publishes a GitHub Release with checksums.

To release:
1. Bump version in `package.json`, `src/index.ts`, and `src/commands/update.ts`
2. Merge the version bump PR
3. Tag main: `git tag v<version> && git push origin v<version>`

## Build

- `bun run build` — bundle to dist/index.mjs
- `bun run build:binary` — compile standalone binaries for all platforms
- `bun run dev` — run from source
