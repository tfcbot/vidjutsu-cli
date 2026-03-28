import { defineCommand } from "citty";
import { apiRequest } from "../client";

export default defineCommand({
  meta: { name: "images", description: "Generate or list images" },
  subCommands: {
    generate: defineCommand({
      meta: { name: "generate", description: "Generate an image" },
      args: {
        prompt: { type: "string", description: "Image prompt", required: true },
        aspect: { type: "string", description: "Aspect ratio" },
        resolution: { type: "string", description: "Resolution (1K, 2K, 4K)" },
        format: { type: "string", description: "Output format (png, jpg)" },
      },
      async run({ args }) {
        const body: Record<string, unknown> = { prompt: args.prompt };
        if (args.aspect) body.aspectRatio = args.aspect;
        if (args.resolution) body.resolution = args.resolution;
        if (args.format) body.outputFormat = args.format;
        const result = await apiRequest("POST", "/v1/images/generate", body);
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    list: defineCommand({
      meta: { name: "list", description: "List images" },
      args: {},
      async run() {
        const result = await apiRequest("GET", "/v1/images");
        console.log(JSON.stringify(result, null, 2));
      },
    }),
    get: defineCommand({
      meta: { name: "get", description: "Get image status" },
      args: {
        id: { type: "positional", description: "Image ID", required: true },
      },
      async run({ args }) {
        const result = await apiRequest("GET", `/v1/images/${args.id}`);
        console.log(JSON.stringify(result, null, 2));
      },
    }),
  },
});
