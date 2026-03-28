import { defineCommand } from "citty";
import { apiRequest } from "../client";

export default defineCommand({
  meta: { name: "chat", description: "Chat with the VidJutsu AI agent" },
  args: {
    prompt: { type: "positional", description: "Message for the agent", required: true },
  },
  async run({ args }) {
    const result = (await apiRequest("POST", "/v1/agent/chat", {
      prompt: args.prompt,
    })) as { response: string };
    console.log(result.response);
  },
});
