import { defineCommand } from "citty";
import { apiRequest } from "../client";

export default defineCommand({
  meta: { name: "generate", description: "Generate a video" },
  args: {
    prompt: { type: "string", description: "Video prompt", required: true },
    model: { type: "string", description: "Model (veo-3.1, veo-3.1-fast)", default: "veo-3.1" },
    image: { type: "string", description: "Image URL for image-to-video mode" },
    aspect: { type: "string", description: "Aspect ratio (16:9, 9:16, 1:1)" },
    duration: { type: "string", description: "Duration in seconds" },
  },
  async run({ args }) {
    const body: Record<string, unknown> = {
      prompt: args.prompt,
      model: args.model,
    };
    if (args.image) body.imageUrl = args.image;
    if (args.aspect) body.aspectRatio = args.aspect;
    if (args.duration) body.duration = parseInt(args.duration);

    const result = await apiRequest("POST", "/v1/videos/generate", body);
    console.log(JSON.stringify(result, null, 2));
  },
});
