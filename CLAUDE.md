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
1. Bump the same version in `package.json` and `src/version.ts`
2. Run `bun run check` (this enforces the version invariant)
3. Merge the release PR
4. Tag the merged commit: `git tag v<version> && git push origin v<version>`

## Build

- `bun run build` — bundle to dist/index.mjs
- `bun run build:binary` — compile standalone binaries for all platforms
- `bun test` — run focused contract and parser tests
- `bun run check` — enforce version parity, test, and build
- `bun run dev` — run from source
