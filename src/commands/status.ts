import { defineCommand } from "citty";
import { apiRequest } from "../client";

export default defineCommand({
  meta: { name: "status", description: "Check resource status by ID" },
  args: {
    id: { type: "positional", description: "Resource ID (vid_xxx, img_xxx, trk_xxx)", required: true },
  },
  async run({ args }) {
    const id = args.id as string;
    let path: string;

    if (id.startsWith("vid_")) path = `/v1/videos/${id}`;
    else if (id.startsWith("img_")) path = `/v1/images/${id}`;
    else if (id.startsWith("trk_")) path = `/v1/music/${id}`;
    else if (id.startsWith("acc_")) path = `/v1/accounts/${id}`;
    else if (id.startsWith("post_")) path = `/v1/posts/${id}`;
    else if (id.startsWith("cmp_")) path = `/v1/campaigns/${id}`;
    else {
      console.error("Unknown ID prefix. Expected vid_, img_, trk_, acc_, post_, or cmp_");
      process.exit(1);
    }

    const result = await apiRequest("GET", path);
    console.log(JSON.stringify(result, null, 2));
  },
});
