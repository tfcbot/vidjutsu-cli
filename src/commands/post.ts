import { defineCommand } from "citty";
import { apiRequest } from "../client";

export default defineCommand({
  meta: { name: "post", description: "Manage posts" },
  subCommands: {
    schedule: defineCommand({
      meta: { name: "schedule", description: "Schedule a post" },
      args: {
        account: { type: "string", description: "Account ID", required: true },
        video: { type: "string", description: "Video ID" },
        caption: { type: "string", description: "Post caption" },
      },
      async run({ args }) {
        const result = await apiRequest("POST", "/v1/posts", {
          accountId: args.account,
          videoId: args.video,
          caption: args.caption,
        });
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    list: defineCommand({
      meta: { name: "list", description: "List posts" },
      args: {},
      async run() {
        const result = await apiRequest("GET", "/v1/posts");
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    get: defineCommand({
      meta: { name: "get", description: "Get post status" },
      args: {
        id: { type: "positional", description: "Post ID", required: true },
      },
      async run({ args }) {
        const result = await apiRequest("GET", `/v1/posts/${args.id}`);
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    cancel: defineCommand({
      meta: { name: "cancel", description: "Cancel a scheduled post" },
      args: {
        id: { type: "positional", description: "Post ID", required: true },
      },
      async run({ args }) {
        const result = await apiRequest("DELETE", `/v1/posts/${args.id}`);
        console.log(JSON.stringify(result, null, 2));
      },
    }),
  },
});
