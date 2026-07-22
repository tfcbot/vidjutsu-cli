// Generated from OpenAPI with CLI-specific argument coercion.
import { defineCommand } from "citty";
import { apiRequest } from "../../client";
import { buildOverlayBody } from "../../command-args";

export default defineCommand({
  meta: { name: "overlay", description: "Burn text overlay onto video" },
  args: {
    "videoUrl": { type: "string", description: "URL of the source video", required: true },
    "text": { type: "string", description: "Overlay text. Use \\n for line breaks.", required: true },
    "position": { type: "string", description: "Vertical text placement" },
    "fontSize": { type: "string", description: "Font size in pixels. Defaults to 4% of video height." },
    "strokeThickness": { type: "string", description: "Text outline thickness (0-10). Defaults to 2." },
  },
  async run({ args }) {
    const body = buildOverlayBody({
      videoUrl: args.videoUrl,
      text: args.text,
      position: args.position,
      fontSize: args.fontSize,
      strokeThickness: args.strokeThickness,
    });
    const result = await apiRequest("POST", "/v1/overlay", body);
    console.log(JSON.stringify(result, null, 2));
  },
});
