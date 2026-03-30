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
        country: { type: "string", description: "Country code" },
        niche: { type: "string", description: "Niche for warming" },
      },
      async run({ args }) {
        const result = await apiRequest("POST", "/v1/accounts", {
          platform: args.platform,
          name: args.name,
          country: args.country,
          niche: args.niche,
        });
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
        const result = await apiRequest("GET", `/v1/accounts/${args.id}`);
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    delete: defineCommand({
      meta: { name: "delete", description: "Delete an account" },
      args: {
        id: { type: "positional", description: "Account ID", required: true },
      },
      async run({ args }) {
        const result = await apiRequest("DELETE", `/v1/accounts/${args.id}`);
        console.log(JSON.stringify(result, null, 2));
      },
    }),
  },
});
