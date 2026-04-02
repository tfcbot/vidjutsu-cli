import { defineCommand } from "citty";
import { apiRequest } from "../client";

export default defineCommand({
  meta: { name: "campaign", description: "Manage campaigns" },
  subCommands: {
    create: defineCommand({
      meta: { name: "create", description: "Create a campaign" },
      args: {
        config: { type: "string", description: "Path to campaign config YAML/JSON" },
      },
      async run({ args }) {
        let config = {};
        if (args.config) {
          const { readFileSync } = await import("fs");
          config = JSON.parse(readFileSync(args.config, "utf-8"));
        }
        const result = await apiRequest("POST", "/v1/campaigns", config);
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    list: defineCommand({
      meta: { name: "list", description: "List campaigns" },
      args: {},
      async run() {
        const result = await apiRequest("GET", "/v1/campaigns");
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    get: defineCommand({
      meta: { name: "get", description: "Get campaign status" },
      args: {
        id: { type: "positional", description: "Campaign ID", required: true },
      },
      async run({ args }) {
        const result = await apiRequest("GET", `/v1/campaigns?id=${args.id}`);
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    execute: defineCommand({
      meta: { name: "execute", description: "Execute a campaign" },
      args: {
        id: { type: "positional", description: "Campaign ID", required: true },
      },
      async run({ args }) {
        const result = await apiRequest("POST", "/v1/campaigns/execute", {
          campaignId: args.id,
        });
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    cancel: defineCommand({
      meta: { name: "cancel", description: "Cancel a campaign and refund credits" },
      args: {
        id: { type: "positional", description: "Campaign ID", required: true },
      },
      async run({ args }) {
        const result = await apiRequest("POST", "/v1/campaigns/cancel", {
          campaignId: args.id,
        });
        console.log(JSON.stringify(result, null, 2));
      },
    }),
  },
});
