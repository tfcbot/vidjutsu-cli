import packageJson from "../package.json";
import { VERSION } from "../src/version";

if (packageJson.version !== VERSION) {
  throw new Error(
    `Version mismatch: package.json=${packageJson.version}, src/version.ts=${VERSION}`,
  );
}

console.log(`Version invariant passed: ${VERSION}`);
