import { defineCommand } from "citty";
import { apiRequest } from "../client";

export default defineCommand({
  meta: { name: "breakdown", description: "Break down a video into scenes and structure" },
  args: {
    "video-url": { type: "string", description: "Video URL to analyze", required: true },
    prompt: { type: "string", description: "Custom prompt for breakdown" },
  },
  async run({ args }) {
    const body: Record<string, unknown> = {
      mediaUrl: args["video-url"],
      mediaType: "video",
    };
    if (args.prompt) body.prompt = args.prompt;

    const created = (await apiRequest("POST", "/v1/breakdown", body)) as Record<string, unknown>;
    const id = created.id as string;

    if (!id) {
      console.log(JSON.stringify(created, null, 2));
      return;
    }

    console.log(`Breakdown started (${id}), polling...`);

    // Poll until complete
    while (true) {
      await new Promise((r) => setTimeout(r, 5000));
      const status = (await apiRequest("GET", `/v1/breakdown?id=${id}`)) as Record<string, unknown>;

      if (status.status === "completed" || status.status === "failed") {
        console.log(JSON.stringify(status, null, 2));
        return;
      }

      console.log(`Status: ${status.status ?? "processing"}...`);
    }
  },
});
