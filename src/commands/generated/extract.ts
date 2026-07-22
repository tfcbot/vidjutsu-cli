// Generated from OpenAPI with CLI-specific argument coercion.
import { defineCommand } from "citty";
import { apiRequest } from "../../client";
import { buildExtractBody } from "../../command-args";

export default defineCommand({
  meta: { name: "extract", description: "Extract frames, audio, and metadata from a video" },
  args: {
    "mediaUrl": { type: "string", description: "URL of the video to extract from", required: true },
    "frames": { type: "string", description: "Frame indices to extract. Use [0, 75, 150] for specific frames, 'auto' for 3 evenly spaced, or 'last' for the final frame" },
    "audio": { type: "boolean", description: "Extract audio track as WAV" },
    "metadata": { type: "boolean", description: "Return video metadata (width, height, fps, duration). Defaults to true" },
  },
  async run({ args }) {
    const body = buildExtractBody({
      mediaUrl: args.mediaUrl,
      frames: args.frames,
      audio: args.audio,
      metadata: args.metadata,
    });
    const result = await apiRequest("POST", "/v1/extract", body);
    console.log(JSON.stringify(result, null, 2));
  },
});
