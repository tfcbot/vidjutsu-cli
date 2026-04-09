import { defineCommand } from "citty";
import { apiRequest } from "../client";

export default defineCommand({
  meta: { name: "subscribe", description: "Subscribe to VidJutsu ($99/mo)" },
  args: {
    email: { type: "string", description: "Email for checkout" },
  },
  async run({ args }) {
    const result = await apiRequest("POST", "/v1/subscribe", {
      email: args.email,
    });
    console.log(JSON.stringify(result, null, 2));
  },
});
