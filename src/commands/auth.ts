import { defineCommand } from "citty";
import { setApiKey, getConfig } from "../client";

export default defineCommand({
  meta: { name: "auth", description: "Authenticate with your VidJutsu API key" },
  args: {
    key: { type: "string", description: "Your VidJutsu API key (vj_...)" },
  },
  async run({ args }) {
    if (args.key) {
      setApiKey(args.key);
      console.log("Authenticated. API key saved.");
    } else {
      const config = getConfig();
      if (config.apiKey) {
        const masked = config.apiKey.slice(0, 7) + "****";
        console.log(`Current auth: ${masked}`);
      } else {
        console.log('Not authenticated. Run "vidjutsu auth --key <your_api_key>"');
        console.log('Get a key at https://docs.vidjutsu.ai/quickstart');
      }
    }
  },
});
