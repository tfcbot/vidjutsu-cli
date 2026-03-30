import { defineCommand } from "citty";
import { apiRequest } from "../client";

export default defineCommand({
  meta: { name: "analytics", description: "Account analytics and video stats" },
  subCommands: {
    get: defineCommand({
      meta: { name: "get", description: "Get account analytics" },
      args: {
        accountId: { type: "positional", description: "Account ID", required: true },
      },
      async run({ args }) {
        const result = await apiRequest("GET", `/v1/analytics?accountId=${args.accountId}`);
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    videos: defineCommand({
      meta: { name: "videos", description: "Get video-level stats for an account" },
      args: {
        accountId: { type: "positional", description: "Account ID", required: true },
      },
      async run({ args }) {
        const result = await apiRequest("GET", `/v1/analytics/videos?accountId=${args.accountId}`);
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    refresh: defineCommand({
      meta: { name: "refresh", description: "Refresh analytics (48h cooldown)" },
      args: {
        accountId: { type: "positional", description: "Account ID", required: true },
      },
      async run({ args }) {
        const result = await apiRequest("POST", "/v1/analytics/refresh", {
          accountId: args.accountId,
        });
        console.log(JSON.stringify(result, null, 2));
      },
    }),
  },
});
