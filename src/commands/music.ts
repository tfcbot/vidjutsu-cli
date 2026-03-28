import { defineCommand } from "citty";
import { apiRequest } from "../client";

export default defineCommand({
  meta: { name: "music", description: "Generate or list music" },
  subCommands: {
    generate: defineCommand({
      meta: { name: "generate", description: "Generate music" },
      args: {
        prompt: { type: "string", description: "Music prompt", required: true },
        instrumental: { type: "boolean", description: "Instrumental only", default: true },
        title: { type: "string", description: "Song title (custom mode)" },
        style: { type: "string", description: "Style tags (custom mode)" },
      },
      async run({ args }) {
        const body: Record<string, unknown> = {
          prompt: args.prompt,
          instrumental: args.instrumental,
        };
        if (args.title) body.title = args.title;
        if (args.style) body.style = args.style;
        const result = await apiRequest("POST", "/v1/music/generate", body);
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    list: defineCommand({
      meta: { name: "list", description: "List music tracks" },
      args: {},
      async run() {
        const result = await apiRequest("GET", "/v1/music");
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    get: defineCommand({
      meta: { name: "get", description: "Get track status" },
      args: {
        id: { type: "positional", description: "Track ID", required: true },
      },
      async run({ args }) {
        const result = await apiRequest("GET", `/v1/music/${args.id}`);
        console.log(JSON.stringify(result, null, 2));
      },
    }),
  },
});
