import { defineCommand } from "citty";
import { apiRequest } from "../client";

export default defineCommand({
  meta: {
    name: "task",
    description: "Submit and tail asynchronous VidJutsu agent tasks",
  },
  subCommands: {
    create: defineCommand({
      meta: {
        name: "create",
        description: "Submit a goal-oriented media task",
      },
      args: {
        prompt: {
          type: "string",
          required: true,
          description: "Task goal and acceptance criteria",
        },
        url: {
          type: "string",
          description: "HTTP(S), TikTok, or Instagram source URL",
        },
        asset: {
          type: "string",
          description: "Existing VidJutsu source asset ID",
        },
        name: {
          type: "string",
          default: "source_video",
          description: "Logical input name",
        },
        "idempotency-key": {
          type: "string",
          required: true,
          description: "Safe retry key",
        },
      },
      async run({ args }) {
        if (args.url && args.asset) {
          throw new Error("Provide at most one of --url or --asset");
        }
        const inputs = args.url
          ? [{ name: args.name, url: args.url }]
          : args.asset
            ? [{ name: args.name, assetId: args.asset }]
            : [];
        const result = await apiRequest(
          "POST",
          "/v1/agent/tasks",
          { prompt: args.prompt, inputs },
          { idempotencyKey: args["idempotency-key"] },
        );
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    events: defineCommand({
      meta: {
        name: "events",
        description: "Read structured task events",
      },
      args: {
        id: {
          type: "positional",
          required: true,
          description: "Agent task ID",
        },
        after: {
          type: "string",
          description: "Return events after this event ID",
        },
        limit: {
          type: "string",
          default: "100",
          description: "Maximum events",
        },
      },
      async run({ args }) {
        const query = new URLSearchParams({
          id: args.id,
          limit: args.limit,
        });
        if (args.after) query.set("after", args.after);
        const result = await apiRequest(
          "GET",
          `/v1/agent/tasks/events?${query.toString()}`,
        );
        console.log(JSON.stringify(result, null, 2));
      },
    }),
  },
});
