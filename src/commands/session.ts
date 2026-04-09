import { defineCommand } from "citty";
import { getConfig, setApiKey } from "../client";

export default defineCommand({
  meta: { name: "session", description: "Retrieve your API key after payment" },
  args: {
    id: { type: "positional", description: "Stripe session ID (cs_live_xxx)", required: true },
  },
  async run({ args }) {
    const config = getConfig();
    const url = `${config.apiUrl}/v1/credits/status?session=${args.id}`;

    const res = await fetch(url);
    const json = (await res.json()) as any;

    if (!res.ok) {
      console.error(json.message ?? json.error ?? `HTTP ${res.status}`);
      process.exit(1);
    }

    if (json.status === "pending") {
      console.log("Payment is still processing. Try again in a few seconds.");
      process.exit(0);
    }

    if (json.status === "already_claimed") {
      console.log("This session has already been claimed. Your API key was returned on the first retrieval.");
      console.log('If you lost your key, use "vidjutsu auth --key <your_key>" to re-authenticate, or rotate it via the API.');
      process.exit(1);
    }

    console.log(`\nAPI Key:       ${json.apiKey}`);
    console.log(`Client ID:     ${json.clientId}`);
    console.log(`Balance:       ${json.balance} credits`);
    console.log(`Subscription:  ${json.subscription ?? "none"}`);

    // Auto-save the API key
    setApiKey(json.apiKey);
    console.log(`\nAPI key saved. You're authenticated — start with "vidjutsu balance".`);
  },
});
