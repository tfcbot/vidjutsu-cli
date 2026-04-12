// AUTO-GENERATED — do not edit. Run `bun run codegen` to regenerate.
import { defineCommand } from "citty";
import { apiRequest } from "../../client";

export default defineCommand({
  meta: { name: "check-run", description: "Run spec validation" },
  args: {
    "spec": { type: "string", description: "VidLang spec JSON to validate", required: true },
    "rules": { type: "string", description: "Optional custom rules as plain text strings. Evaluated by AI" },
  },
  async run({ args }) {
    const body: Record<string, unknown> = {};
    if (args["spec"] !== undefined) body["spec"] = args["spec"];
    if (args["rules"] !== undefined) body["rules"] = args["rules"];
    const result = await apiRequest("POST", "/v1/check", body);
    console.log(JSON.stringify(result, null, 2));
  },
});
