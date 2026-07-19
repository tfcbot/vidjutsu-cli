import { defineCommand } from "citty";
import { apiRequest } from "../client";

export default defineCommand({
  meta: { name: "character", description: "Create reusable AI characters" },
  subCommands: {
    create: defineCommand({
      meta: { name: "create", description: "Create a character identity" },
      args: {
        prompt: { type: "string", required: true, description: "Character prompt" },
        references: { type: "string", description: "Comma-separated image asset IDs" },
        execute: { type: "boolean", description: "Use live adapters" },
        "idempotency-key": { type: "string", description: "Safe retry key", required: true },
      },
      async run({ args }) {
        const result = await apiRequest(
          "POST",
          "/v1/characters",
          {
            prompt: args.prompt,
            referenceImageAssetIds: args.references
              ?.split(",")
              .map((id) => id.trim())
              .filter(Boolean),
            dryRun: args.execute !== true,
          },
          { idempotencyKey: args["idempotency-key"] },
        );
        console.log(JSON.stringify(result, null, 2));
      },
    }),
  },
});
