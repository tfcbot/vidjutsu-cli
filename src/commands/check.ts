import { defineCommand } from "citty";
import { getConfig } from "../client";
import { readFileSync } from "fs";

export default defineCommand({
  meta: { name: "check", description: "Validate a VidLang spec against rules" },
  args: {
    spec: { type: "string", required: true, description: "Path to spec JSON file" },
    rules: { type: "string", description: "Custom rules (comma-separated)" },
  },
  async run({ args }) {
    const config = getConfig();
    if (!config.apiKey) {
      throw new Error('Not authenticated. Run "vidjutsu auth --key <your_api_key>" first.');
    }

    const specContent = readFileSync(args.spec, "utf-8");
    let spec: unknown;
    try {
      spec = JSON.parse(specContent);
    } catch {
      throw new Error(`Failed to parse spec file: ${args.spec}`);
    }

    const rules = args.rules
      ? args.rules.split(",").map((r: string) => r.trim())
      : undefined;

    console.log("Checking spec...");

    const res = await fetch(`${config.apiUrl}/v1/check`, {
      method: "POST",
      headers: { "X-Api-Key": config.apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ spec, rules }),
    });

    const json = await res.json();

    if (!res.ok) {
      const msg = typeof json === "object" && json !== null && "error" in json
        ? (json as any).message ?? (json as any).error
        : `HTTP ${res.status}`;
      throw new Error(msg);
    }

    const data = json as any;
    if (data.passed) {
      console.log("✓ All checks passed");
    } else {
      console.log("✗ Failed checks:");
      for (const r of data.results ?? []) {
        if (!r.passed) {
          console.log(`  [${r.severity}] ${r.rule}: ${r.message}`);
        }
      }
    }
  },
});
