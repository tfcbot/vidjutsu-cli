import { defineCommand } from "citty";
import { apiRequest } from "../client";

async function getJob(jobId: string): Promise<any> {
  return await apiRequest("GET", `/v1/jobs?id=${encodeURIComponent(jobId)}`);
}

export default defineCommand({
  meta: { name: "jobs", description: "Inspect durable media jobs" },
  subCommands: {
    get: defineCommand({
      meta: { name: "get", description: "Get a job" },
      args: { id: { type: "positional", required: true, description: "Job ID" } },
      async run({ args }) {
        console.log(JSON.stringify(await getJob(args.id), null, 2));
      },
    }),
    wait: defineCommand({
      meta: { name: "wait", description: "Wait for a terminal job" },
      args: {
        id: { type: "positional", required: true, description: "Job ID" },
        timeout: { type: "string", default: "600", description: "Seconds" },
        interval: { type: "string", default: "1000", description: "Milliseconds" },
      },
      async run({ args }) {
        const deadline = Date.now() + Number(args.timeout) * 1_000;
        while (true) {
          const job = await getJob(args.id);
          if (job.status === "completed") {
            console.log(JSON.stringify(job, null, 2));
            return;
          }
          if (job.status === "failed" || job.status === "cancelled") {
            throw new Error(job.error?.message ?? `Job ${job.status}`);
          }
          if (Date.now() >= deadline) throw new Error(`Timed out waiting for ${args.id}`);
          await new Promise((resolve) => setTimeout(resolve, Number(args.interval)));
        }
      },
    }),
  },
});
