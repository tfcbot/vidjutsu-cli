import { defineCommand } from "citty";
import { apiRequest } from "../client";
import { cloneModel, lowScoreOverride, sourceFromArgs } from "../clone-source";

const sourceArgs = {
  youtube: { type: "string" as const, description: "One YouTube watch URL" },
  url: { type: "string" as const, description: "Direct HTTP(S) video URL" },
  asset: { type: "string" as const, description: "Existing VidJutsu video asset ID" },
};

export default defineCommand({
  meta: { name: "clone", description: "Check and clone short-form source videos" },
  subCommands: {
    check: defineCommand({
      meta: { name: "check", description: "Score source cloneability" },
      args: {
        ...sourceArgs,
        rubric: { type: "string", default: "cloneability-v1" },
        execute: { type: "boolean", description: "Dispatch EVE instead of dry-run" },
        "idempotency-key": { type: "string", description: "Safe retry key", required: true },
      },
      async run({ args }) {
        const result = await apiRequest(
          "POST",
          "/v1/clones/check",
          {
            source: sourceFromArgs(args),
            rubricVersion: args.rubric,
            dryRun: args.execute !== true,
          },
          { idempotencyKey: args["idempotency-key"] },
        );
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    "starting-image": defineCommand({
      meta: { name: "starting-image", description: "Create a clean swapped frame" },
      args: {
        ...sourceArgs,
        character: { type: "string", required: true, description: "Character ID" },
        execute: { type: "boolean", description: "Use live adapters" },
        "idempotency-key": { type: "string", description: "Safe retry key", required: true },
      },
      async run({ args }) {
        const result = await apiRequest(
          "POST",
          "/v1/clones/starting-image",
          {
            source: sourceFromArgs(args),
            characterId: args.character,
            dryRun: args.execute !== true,
          },
          { idempotencyKey: args["idempotency-key"] },
        );
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    video: defineCommand({
      meta: { name: "video", description: "Clone with Seedance or Kling motion control" },
      args: {
        ...sourceArgs,
        "starting-image": { type: "string", required: true, description: "Starting image asset ID" },
        model: { type: "string", required: true, description: "seedance or kling-motion-control" },
        check: { type: "string", description: "Reusable clone-check ID" },
        override: { type: "boolean", description: "Allow a score below 70" },
        reason: { type: "string", description: "Required override reason" },
        execute: { type: "boolean", description: "Use live adapters" },
        "idempotency-key": { type: "string", description: "Safe retry key", required: true },
      },
      async run({ args }) {
        const result = await apiRequest(
          "POST",
          "/v1/clones/video",
          {
            source: sourceFromArgs(args),
            startingImageAssetId: args["starting-image"],
            model: cloneModel(args.model),
            cloneCheckId: args.check,
            override: lowScoreOverride(args),
            dryRun: args.execute !== true,
          },
          { idempotencyKey: args["idempotency-key"] },
        );
        console.log(JSON.stringify(result, null, 2));
      },
    }),
  },
});
