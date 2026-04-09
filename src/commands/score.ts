import { defineCommand } from "citty";
import { apiRequest } from "../client";

export default defineCommand({
  meta: { name: "score", description: "Score a video for a niche" },
  args: {
    "video-url": { type: "string", description: "Video URL to score", required: true },
    niche: { type: "string", description: "Niche keyword", required: true },
    type: { type: "string", description: "Content format type" },
  },
  async run({ args }) {
    const body: Record<string, unknown> = {
      mediaUrl: args["video-url"],
      mediaType: "video",
      niches: [args.niche],
    };
    if (args.type) body.type = args.type;

    const result = (await apiRequest("POST", "/v1/score", body)) as Record<string, unknown>;

    if (result.score != null) console.log(`Score: ${result.score}`);
    if (result.breakdown) {
      console.log("Breakdown:");
      const bd = result.breakdown as Record<string, unknown>;
      for (const [key, value] of Object.entries(bd)) {
        console.log(`  ${key}: ${value}`);
      }
    }
    if (Array.isArray(result.suggestions) && result.suggestions.length > 0) {
      console.log("Suggestions:");
      for (const s of result.suggestions) {
        console.log(`  - ${s}`);
      }
    }
  },
});
