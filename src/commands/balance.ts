import { defineCommand } from "citty";
import { apiRequest } from "../client";

export default defineCommand({
  meta: { name: "balance", description: "Check credit balance" },
  args: {},
  async run() {
    const result = await apiRequest("GET", "/v1/balance");
    console.log(JSON.stringify(result, null, 2));
  },
});
