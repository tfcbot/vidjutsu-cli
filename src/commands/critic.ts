import { defineCommand } from "citty";
import { apiRequest } from "../client";

export default defineCommand({
  meta: { name: "critic", description: "Critique a video for quality issues" },
  args: {
    "video-url": { type: "string", description: "Video URL to analyze", required: true },
    context: { type: "string", description: "Additional context for the critique" },
  },
  async run({ args }) {
    const body: Record<string, unknown> = {
      mediaUrl: args["video-url"],
      mediaType: "video",
    };
    if (args.context) body.context = args.context;

    const result = (await apiRequest("POST", "/v1/critic", body)) as Record<string, unknown>;

    if (result.score != null) console.log(`Score:   ${result.score}`);
    if (result.verdict) console.log(`Verdict: ${result.verdict}`);
    if (Array.isArray(result.issues) && result.issues.length > 0) {
      console.log("Issues:");
      for (const issue of result.issues) {
        console.log(`  - ${issue}`);
      }
    }
  },
});
