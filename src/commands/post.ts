import { defineCommand } from "citty";
import { apiRequest } from "../client";

export default defineCommand({
  meta: { name: "post", description: "Manage posts" },
  subCommands: {
    create: defineCommand({
      meta: { name: "create", description: "Create a draft post" },
      args: {
        account: { type: "string", description: "Account ID" },
        caption: { type: "string", description: "Post caption" },
        "video-url": { type: "string", description: "Video URL" },
        video: { type: "string", description: "Video ID" },
      },
      async run({ args }) {
        const body: Record<string, unknown> = {};
        if (args.account) body.accountId = args.account;
        if (args.caption) body.caption = args.caption;
        if (args["video-url"]) body.videoUrl = args["video-url"];
        if (args.video) body.videoId = args.video;

        const result = await apiRequest("POST", "/v1/posts", body);
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    edit: defineCommand({
      meta: { name: "edit", description: "Edit a draft post" },
      args: {
        id: { type: "positional", description: "Post ID", required: true },
        caption: { type: "string", description: "Post caption" },
        "video-url": { type: "string", description: "Video URL" },
        video: { type: "string", description: "Video ID" },
        account: { type: "string", description: "Account ID" },
      },
      async run({ args }) {
        const body: Record<string, unknown> = {};
        if (args.caption) body.caption = args.caption;
        if (args["video-url"]) body.videoUrl = args["video-url"];
        if (args.video) body.videoId = args.video;
        if (args.account) body.accountId = args.account;

        const result = await apiRequest("PUT", `/v1/posts?id=${args.id}`, body);
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
      meta: { name: "get", description: "Get post details" },
      args: {
        id: { type: "positional", description: "Post ID", required: true },
      },
      async run({ args }) {
        const result = await apiRequest("GET", `/v1/posts?id=${args.id}`);
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    delete: defineCommand({
      meta: { name: "delete", description: "Delete a post" },
      args: {
        id: { type: "positional", description: "Post ID", required: true },
      },
      async run({ args }) {
        const result = await apiRequest("DELETE", `/v1/posts?id=${args.id}`);
        console.log(JSON.stringify(result, null, 2));
      },
    }),
  },
});
