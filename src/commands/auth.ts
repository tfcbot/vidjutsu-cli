import { defineCommand } from "citty";
import { setPayment, getConfig } from "../client";

export default defineCommand({
  meta: { name: "auth", description: "Authenticate with payment credential" },
  args: {
    card: { type: "string", description: "Card token for stripe402 payments" },
    wallet: { type: "string", description: "Wallet address for x402 USDC payments" },
  },
  async run({ args }) {
    if (args.card) {
      setPayment(`card:${args.card}`);
      console.log("Authenticated with card payment method.");
    } else if (args.wallet) {
      setPayment(`wallet:${args.wallet}`);
      console.log("Authenticated with wallet payment method.");
    } else {
      const config = getConfig();
      if (config.payment) {
        console.log(`Current auth: ${config.payment.split(":")[0]}:****`);
      } else {
        console.log('Not authenticated. Use --card <token> or --wallet <address>');
      }
    }
  },
});
