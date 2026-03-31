import { defineCommand } from "citty";
import { apiRequest } from "../client";

export default defineCommand({
  meta: { name: "post", description: "Manage posts" },
  subCommands: {
    draft: defineCommand({
      meta: { name: "draft", description: "Create a draft post (no account required)" },
      args: {
        account: { type: "string", description: "Account ID (optional for drafts)" },
        caption: { type: "string", description: "Post caption" },
        "video-url": { type: "string", description: "Video URL" },
      },
      async run({ args }) {
        const result = await apiRequest("POST", "/v1/posts", {
          draft: true,
          accountId: args.account,
          caption: args.caption,
          videoUrl: args["video-url"],
        });
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    schedule: defineCommand({
      meta: { name: "schedule", description: "Schedule a post (account required)" },
      args: {
        account: { type: "string", description: "Account ID", required: true },
        "video-url": { type: "string", description: "Video URL" },
        video: { type: "string", description: "Video ID" },
        caption: { type: "string", description: "Post caption" },
      },
      async run({ args }) {
        const result = await apiRequest("POST", "/v1/posts", {
          accountId: args.account,
          videoId: args.video,
          videoUrl: args["video-url"],
          caption: args.caption,
        });
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    assign: defineCommand({
      meta: { name: "assign", description: "Assign a draft post to an account" },
      args: {
        id: { type: "positional", description: "Post ID", required: true },
        account: { type: "string", description: "Account ID", required: true },
      },
      async run({ args }) {
        const result = await apiRequest("POST", "/v1/posts/assign", {
          postId: args.id,
          accountId: args.account,
        });
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    duplicate: defineCommand({
      meta: { name: "duplicate", description: "Duplicate a post (optionally to a different account)" },
      args: {
        id: { type: "positional", description: "Post ID", required: true },
        account: { type: "string", description: "Target account ID" },
      },
      async run({ args }) {
        const result = await apiRequest("POST", "/v1/posts/duplicate", {
          postId: args.id,
          accountId: args.account,
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
      meta: { name: "cancel", description: "Cancel a draft or scheduled post" },
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
