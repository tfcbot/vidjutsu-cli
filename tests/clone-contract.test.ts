import { describe, expect, test } from "bun:test";
import {
  CLONE_PATHS,
  buildCharacterRequest,
  buildCloneCheckRequest,
  buildCloneVideoRequest,
  buildStartingImageRequest,
  cloneVideoStatusPath,
  parseCloneModel,
  runTikTokClone,
  type ApiRequester,
} from "../src/clone-contract";

describe("clone endpoint contracts", () => {
  test("builds clone-check, character, and list contracts", () => {
    expect(CLONE_PATHS.check).toBe("/v1/clones/check");
    expect(buildCloneCheckRequest("https://cdn.example/source.mp4", "product shot")).toEqual({
      videoUrl: "https://cdn.example/source.mp4",
      context: "product shot",
    });
    expect(CLONE_PATHS.characters).toBe("/v1/characters");
    expect(buildCharacterRequest("a chef", "https://cdn.example/ref.png")).toEqual({
      prompt: "a chef",
      referenceImageUrl: "https://cdn.example/ref.png",
    });
  });

  test("starting-image body contains only the current required fields", () => {
    const body = buildStartingImageRequest(
      "https://cdn.example/frame.png",
      "char_123",
      "Preserve framing and replace identity",
    );
    expect(CLONE_PATHS.startingImage).toBe("/v1/clones/starting-image");
    expect(body).toEqual({
      firstFrame: "https://cdn.example/frame.png",
      characterId: "char_123",
      prompt: "Preserve framing and replace identity",
    });
    expect(Object.keys(body).sort()).toEqual(["characterId", "firstFrame", "prompt"]);
  });

  test("video is Kling-only and status uses the path parameter", () => {
    expect(buildCloneVideoRequest({
      startingImageUrl: "https://cdn.example/start.png",
      sourceVideoUrl: "https://cdn.example/source.mp4",
    })).toEqual({
      startingImageUrl: "https://cdn.example/start.png",
      sourceVideoUrl: "https://cdn.example/source.mp4",
      model: "kling",
    });
    expect(parseCloneModel("kling")).toBe("kling");
    expect(() => parseCloneModel("other")).toThrow("must be kling");
    expect(CLONE_PATHS.video).toBe("/v1/clones/video");
    expect(cloneVideoStatusPath("clone/a b")).toBe("/v1/clones/video/clone%2Fa%20b");
  });

  test("full TikTok run sends every path and exact request body in order", async () => {
    const calls: Array<{ method: string; path: string; body: unknown }> = [];
    const request: ApiRequester = async (method, path, body) => {
      calls.push({ method, path, body });
      if (path === CLONE_PATHS.tiktokDownload) return { url: "https://cdn.example/source.mp4" };
      if (path === CLONE_PATHS.check) return { verdict: "strong", score: 95 };
      if (path === CLONE_PATHS.extract) return { frames: [{ index: 0, url: "https://cdn.example/frame.png" }] };
      if (path === CLONE_PATHS.startingImage) return { imageUrl: "https://cdn.example/start.png" };
      if (path === CLONE_PATHS.video) return { id: "clone_123", status: "processing" };
      throw new Error(`Unexpected path: ${path}`);
    };

    await runTikTokClone(request, {
      tiktokUrl: "https://www.tiktok.com/@creator/video/123",
      characterId: "char_123",
      prompt: "Keep pose and background",
      context: "Use the product naturally",
      videoPrompt: "Preserve the original performance",
    });

    expect(calls).toEqual([
      {
        method: "POST",
        path: "/v1/videos/download/tiktok",
        body: { url: "https://www.tiktok.com/@creator/video/123" },
      },
      {
        method: "POST",
        path: "/v1/clones/check",
        body: {
          videoUrl: "https://cdn.example/source.mp4",
          context: "Use the product naturally",
        },
      },
      {
        method: "POST",
        path: "/v1/extract",
        body: { mediaUrl: "https://cdn.example/source.mp4", frames: [0] },
      },
      {
        method: "POST",
        path: "/v1/clones/starting-image",
        body: {
          firstFrame: "https://cdn.example/frame.png",
          characterId: "char_123",
          prompt: "Keep pose and background",
        },
      },
      {
        method: "POST",
        path: "/v1/clones/video",
        body: {
          startingImageUrl: "https://cdn.example/start.png",
          sourceVideoUrl: "https://cdn.example/source.mp4",
          model: "kling",
          prompt: "Preserve the original performance",
        },
      },
    ]);
  });
});
