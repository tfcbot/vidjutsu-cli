import { defineCommand } from "citty";
import { apiRequest } from "../client";

function parseTags(raw?: string): Array<{ key: string; value: string }> | undefined {
  if (!raw) return undefined;
  return raw.split(",").map((pair) => {
    const [key, ...rest] = pair.split("=");
    return { key: key.trim(), value: rest.join("=").trim() };
  });
}

export default defineCommand({
  meta: { name: "post", description: "Manage posts" },
  subCommands: {
    create: defineCommand({
<<<<<<< Updated upstream
      meta: { name: "create", description: "Create a draft post" },
      args: {
        account: { type: "string", description: "Account ID" },
        caption: { type: "string", description: "Post caption" },
        "video-url": { type: "string", description: "Video URL" },
        video: { type: "string", description: "Video ID" },
=======
      meta: { name: "create", description: "Create a draft post (0 credits)" },
      args: {
        account: { type: "string", description: "Account ID" },
        video: { type: "string", description: "Video ID" },
        "video-url": { type: "string", description: "Video URL" },
        caption: { type: "string", description: "Post caption" },
        brief: { type: "string", description: "Brief ID" },
        "scheduled-at": { type: "string", description: "Scheduled time (ISO 8601)" },
        tags: { type: "string", description: "Tags as key=value pairs, comma-separated" },
>>>>>>> Stashed changes
      },
      async run({ args }) {
        const body: Record<string, unknown> = {};
        if (args.account) body.accountId = args.account;
<<<<<<< Updated upstream
        if (args.caption) body.caption = args.caption;
        if (args["video-url"]) body.mediaUrl = args["video-url"];
        if (args.video) body.videoId = args.video;
=======
        if (args.video) body.videoId = args.video;
        if (args["video-url"]) body.videoUrl = args["video-url"];
        if (args.caption) body.caption = args.caption;
        if (args.brief) body.brief = args.brief;
        if (args["scheduled-at"]) body.scheduledAt = args["scheduled-at"];
        const tags = parseTags(args.tags);
        if (tags) body.tags = tags;
>>>>>>> Stashed changes

        const result = await apiRequest("POST", "/v1/posts", body);
        console.log(JSON.stringify(result, null, 2));
      },
    }),
<<<<<<< Updated upstream
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
        if (args["video-url"]) body.mediaUrl = args["video-url"];
        if (args.video) body.videoId = args.video;
        if (args.account) body.accountId = args.account;

        const result = await apiRequest("PUT", `/v1/posts?id=${args.id}`, body);
=======
    schedule: defineCommand({
      meta: { name: "schedule", description: "Schedule a draft post (36 credits)" },
      args: {
        id: { type: "positional", description: "Post ID", required: true },
      },
      async run({ args }) {
        const result = await apiRequest("POST", "/v1/posts/schedule", {
          postId: args.id,
        });
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
        "scheduled-at": { type: "string", description: "Scheduled time (ISO 8601)" },
        brief: { type: "string", description: "Brief ID" },
        tags: { type: "string", description: "Tags as key=value pairs, comma-separated" },
      },
      async run({ args }) {
        const body: Record<string, unknown> = {};
        if (args.caption) body.caption = args.caption;
        if (args["video-url"]) body.videoUrl = args["video-url"];
        if (args.video) body.videoId = args.video;
        if (args.account) body.accountId = args.account;
        if (args["scheduled-at"]) body.scheduledAt = args["scheduled-at"];
        if (args.brief) body.brief = args.brief;
        const tags = parseTags(args.tags);
        if (tags) body.tags = tags;

        const result = await apiRequest("PUT", `/v1/posts?id=${args.id}`, body);
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
>>>>>>> Stashed changes
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    list: defineCommand({
      meta: { name: "list", description: "List posts" },
      args: {
        tag: { type: "string", description: "Filter by tag (key=value)" },
      },
      async run({ args }) {
        let path = "/v1/posts";
        if (args.tag) {
          const [key, ...rest] = args.tag.split("=");
          const value = rest.join("=");
          path += `?tag.${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
        const result = await apiRequest("GET", path);
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
