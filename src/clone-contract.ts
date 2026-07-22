export const CLONE_PATHS = {
  check: "/v1/clones/check",
  characters: "/v1/characters",
  startingImage: "/v1/clones/starting-image",
  video: "/v1/clones/video",
  tiktokDownload: "/v1/videos/download/tiktok",
  extract: "/v1/extract",
} as const;

export type ApiRequester = (
  method: string,
  path: string,
  body?: unknown,
) => Promise<unknown>;

export function buildCloneCheckRequest(videoUrl: string, context?: string) {
  return context === undefined ? { videoUrl } : { videoUrl, context };
}

export function buildCharacterRequest(prompt: string, referenceImageUrl?: string) {
  return referenceImageUrl === undefined
    ? { prompt }
    : { prompt, referenceImageUrl };
}

export function buildStartingImageRequest(
  firstFrame: string,
  characterId: string,
  prompt: string,
) {
  return { firstFrame, characterId, prompt };
}

export function parseCloneModel(value: string | undefined): "kling" {
  if (value === undefined || value === "kling") return "kling";
  throw new Error("--model must be kling");
}

export function buildCloneVideoRequest(args: {
  startingImageUrl: string;
  sourceVideoUrl: string;
  model?: string;
  prompt?: string;
}) {
  const body: {
    startingImageUrl: string;
    sourceVideoUrl: string;
    model: "kling";
    prompt?: string;
  } = {
    startingImageUrl: args.startingImageUrl,
    sourceVideoUrl: args.sourceVideoUrl,
    model: parseCloneModel(args.model),
  };
  if (args.prompt !== undefined) body.prompt = args.prompt;
  return body;
}

export function cloneVideoStatusPath(id: string): string {
  return `${CLONE_PATHS.video}/${encodeURIComponent(id)}`;
}

function requiredString(value: unknown, property: string, operation: string): string {
  if (
    typeof value !== "object" ||
    value === null ||
    typeof (value as Record<string, unknown>)[property] !== "string"
  ) {
    throw new Error(`${operation} response did not include ${property}`);
  }
  return (value as Record<string, string>)[property];
}

export interface TikTokCloneInput {
  tiktokUrl: string;
  characterId: string;
  prompt: string;
  context?: string;
  videoPrompt?: string;
}

export async function runTikTokClone(request: ApiRequester, input: TikTokCloneInput) {
  const source = await request("POST", CLONE_PATHS.tiktokDownload, {
    url: input.tiktokUrl,
  });
  const sourceVideoUrl = requiredString(source, "url", "TikTok download");

  const check = await request(
    "POST",
    CLONE_PATHS.check,
    buildCloneCheckRequest(sourceVideoUrl, input.context),
  );

  const extraction = await request("POST", CLONE_PATHS.extract, {
    mediaUrl: sourceVideoUrl,
    frames: [0],
  });
  const frames =
    typeof extraction === "object" && extraction !== null
      ? (extraction as { frames?: unknown }).frames
      : undefined;
  const firstFrame =
    Array.isArray(frames) && frames.length > 0
      ? requiredString(frames[0], "url", "Extract")
      : undefined;
  if (firstFrame === undefined) {
    throw new Error("Extract response did not include frames[0].url");
  }

  const startingImage = await request(
    "POST",
    CLONE_PATHS.startingImage,
    buildStartingImageRequest(firstFrame, input.characterId, input.prompt),
  );
  const startingImageUrl = requiredString(
    startingImage,
    "imageUrl",
    "Starting-image",
  );

  const video = await request(
    "POST",
    CLONE_PATHS.video,
    buildCloneVideoRequest({
      startingImageUrl,
      sourceVideoUrl,
      prompt: input.videoPrompt,
    }),
  );

  return { source, check, extraction, startingImage, video };
}
