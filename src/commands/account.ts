import { defineCommand } from "citty";
import { apiRequest } from "../client";

export default defineCommand({
  meta: { name: "account", description: "Manage accounts" },
  subCommands: {
    create: defineCommand({
      meta: { name: "create", description: "Create a managed account" },
      args: {
        platform: { type: "string", description: "Platform (instagram)", required: true },
        name: { type: "string", description: "Account name", required: true },
        handle: { type: "string", description: "Instagram handle" },
        niche: { type: "string", description: "Account niche" },
        bio: { type: "string", description: "Profile biography" },
        pfp: { type: "string", description: "Profile picture URL" },
        link: { type: "string", description: "Link in bio URL" },
      },
      async run({ args }) {
        const body: Record<string, unknown> = {
          platform: args.platform,
          name: args.name,
        };
        if (args.handle) body.handle = args.handle;
        if (args.niche) body.niche = args.niche;
        if (args.bio) body.bio = args.bio;
        if (args.pfp) body.pfp = args.pfp;
        if (args.link) body.linkInBio = args.link;

        const result = await apiRequest("POST", "/v1/accounts", body);
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    edit: defineCommand({
      meta: { name: "edit", description: "Edit an account" },
      args: {
        id: { type: "positional", description: "Account ID", required: true },
        name: { type: "string", description: "Account name" },
        handle: { type: "string", description: "Instagram handle" },
        niche: { type: "string", description: "Account niche" },
        bio: { type: "string", description: "Profile biography" },
        pfp: { type: "string", description: "Profile picture URL" },
        link: { type: "string", description: "Link in bio URL" },
      },
      async run({ args }) {
        const body: Record<string, unknown> = {};
        if (args.name) body.name = args.name;
        if (args.handle) body.handle = args.handle;
        if (args.niche) body.niche = args.niche;
        if (args.bio) body.bio = args.bio;
        if (args.pfp) body.pfp = args.pfp;
        if (args.link) body.linkInBio = args.link;

        const result = await apiRequest("PUT", `/v1/accounts?id=${args.id}`, body);
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    list: defineCommand({
      meta: { name: "list", description: "List accounts" },
      args: {},
      async run() {
        const result = await apiRequest("GET", "/v1/accounts");
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    get: defineCommand({
      meta: { name: "get", description: "Get account details" },
      args: {
        id: { type: "positional", description: "Account ID", required: true },
      },
      async run({ args }) {
        const result = await apiRequest("GET", `/v1/accounts?id=${args.id}`);
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    delete: defineCommand({
      meta: { name: "delete", description: "Delete an account" },
      args: {
        id: { type: "positional", description: "Account ID", required: true },
      },
      async run({ args }) {
        const result = await apiRequest("DELETE", `/v1/accounts?id=${args.id}`);
        console.log(JSON.stringify(result, null, 2));
      },
    }),
  },
});
