import { defineCommand } from "citty";
import { apiRequest } from "../client";

export default defineCommand({
  meta: { name: "subscribe", description: "Subscribe to VidJutsu ($59/mo)" },
  args: {
    email: { type: "string", description: "Email for checkout" },
    "success-url": { type: "string", description: "Redirect URL after payment" },
  },
  async run({ args }) {
    const result = await apiRequest("POST", "/v1/subscriptions", {
      email: args.email,
      successUrl: args["success-url"],
    });
    console.log(JSON.stringify(result, null, 2));
  },
});
