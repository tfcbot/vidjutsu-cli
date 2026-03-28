import { defineCommand } from "citty";
import { apiRequest } from "../client";

export default defineCommand({
  meta: { name: "topup", description: "Add credits to your balance" },
  args: {
    amount: { type: "positional", description: "Number of credits to add", required: true },
  },
  async run({ args }) {
    const amount = parseInt(args.amount as string);
    if (isNaN(amount) || amount <= 0) {
      console.error("Amount must be a positive number");
      process.exit(1);
    }
    const result = await apiRequest("POST", "/v1/topup", { amount });
    console.log(JSON.stringify(result, null, 2));
  },
});
