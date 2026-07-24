import { defineCommand } from "citty";
import { apiRequest } from "../client";
import {
  CLONE_PATHS,
  buildCharacterRequest,
  buildCloneCheckRequest,
  buildCloneVideoRequest,
  buildStartingImageRequest,
  cloneVideoStatusPath,
  runTikTokClone,
} from "../clone-contract";

function print(result: unknown) {
  console.log(JSON.stringify(result, null, 2));
}

export default defineCommand({
  meta: { name: "clone", description: "Check and clone short-form videos with Kling" },
  subCommands: {
    check: defineCommand({
      meta: { name: "check", description: "Evaluate a staged video's cloneability" },
      args: {
        video: { type: "string", required: true, description: "Public HTTPS source video URL" },
      },
      async run({ args }) {
        print(await apiRequest("POST", CLONE_PATHS.check, buildCloneCheckRequest(args.video)));
      },
    }),
    character: defineCommand({
      meta: { name: "character", description: "Manage persisted clone characters" },
      subCommands: {
        create: defineCommand({
          meta: { name: "create", description: "Create a persisted character" },
          args: {
            prompt: { type: "string", required: true, description: "Character description" },
            reference: { type: "string", description: "Optional public HTTPS reference image" },
          },
          async run({ args }) {
            print(await apiRequest("POST", CLONE_PATHS.characters, buildCharacterRequest(args.prompt, args.reference)));
          },
        }),
        list: defineCommand({
          meta: { name: "list", description: "List persisted characters" },
          async run() {
            print(await apiRequest("GET", CLONE_PATHS.characters));
          },
        }),
      },
    }),
    "starting-image": defineCommand({
      meta: { name: "starting-image", description: "Replace identity in an extracted first frame" },
      args: {
        "first-frame": { type: "string", required: true, description: "Public HTTPS first-frame image URL" },
        character: { type: "string", required: true, description: "Persisted character ID" },
        prompt: { type: "string", required: true, description: "Starting-frame edit instructions" },
      },
      async run({ args }) {
        print(await apiRequest(
          "POST",
          CLONE_PATHS.startingImage,
          buildStartingImageRequest(args["first-frame"], args.character, args.prompt),
        ));
      },
    }),
    video: defineCommand({
      meta: { name: "video", description: "Clone source motion with Kling 3.0" },
      args: {
        "starting-image": { type: "string", required: true, description: "Public HTTPS starting-image URL" },
        "source-video": { type: "string", required: true, description: "Public HTTPS source video URL" },
        model: { type: "string", default: "kling", description: "Generation model (kling only)" },
        prompt: { type: "string", description: "Optional motion-control prompt" },
      },
      async run({ args }) {
        print(await apiRequest("POST", CLONE_PATHS.video, buildCloneVideoRequest({
          startingImageUrl: args["starting-image"],
          sourceVideoUrl: args["source-video"],
          model: args.model,
          prompt: args.prompt,
        })));
      },
    }),
    status: defineCommand({
      meta: { name: "status", description: "Get clone-video status" },
      args: {
        id: { type: "positional", required: true, description: "Clone task ID" },
      },
      async run({ args }) {
        print(await apiRequest("GET", cloneVideoStatusPath(args.id)));
      },
    }),
    run: defineCommand({
      meta: { name: "run", description: "Run the complete TikTok-to-Kling clone flow" },
      args: {
        tiktok: { type: "string", required: true, description: "TikTok post URL" },
        character: { type: "string", required: true, description: "Persisted character ID" },
        prompt: { type: "string", required: true, description: "Starting-frame edit instructions" },
        "video-prompt": { type: "string", description: "Optional motion-control prompt" },
      },
      async run({ args }) {
        print(await runTikTokClone(apiRequest, {
          tiktokUrl: args.tiktok,
          characterId: args.character,
          prompt: args.prompt,
          videoPrompt: args["video-prompt"],
        }));
      },
    }),
  },
});
