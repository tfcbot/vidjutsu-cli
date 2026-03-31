import { defineCommand } from "citty";
import { apiRequest } from "../client";
import { readFileSync } from "fs";

export default defineCommand({
  meta: { name: "upload", description: "Upload a file to VidJutsu CDN" },
  args: {
    file: { type: "positional", description: "File path to upload", required: true },
  },
  async run({ args }) {
    const filePath = args.file;
    const buffer = readFileSync(filePath);
    const base64Data = buffer.toString("base64");

    // Detect content type from extension
    const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
    const contentTypes: Record<string, string> = {
      mp4: "video/mp4",
      mov: "video/quicktime",
      webm: "video/webm",
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      webp: "image/webp",
      mp3: "audio/mpeg",
      wav: "audio/wav",
    };
    const contentType = contentTypes[ext] ?? "application/octet-stream";

    console.log(`Uploading ${filePath} (${Math.round(buffer.length / 1024)}KB, ${contentType})...`);

    const result = await apiRequest("POST", "/v1/upload", {
      base64Data,
      contentType,
    });

    console.log(JSON.stringify(result, null, 2));
  },
});
