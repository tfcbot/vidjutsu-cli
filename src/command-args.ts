export function parseFrames(
  value: string | number[] | undefined,
): number[] | "auto" | "last" | undefined {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return validateFrames(value);

  const trimmed = value.trim();
  if (trimmed === "auto" || trimmed === "last") return trimmed;

  let values: unknown;
  if (trimmed.startsWith("[")) {
    try {
      values = JSON.parse(trimmed);
    } catch {
      throw new Error("--frames must be 'auto', 'last', a JSON array, or comma-separated integers");
    }
  } else {
    values = trimmed.split(",").map((part) => Number(part.trim()));
  }

  if (!Array.isArray(values)) {
    throw new Error("--frames must resolve to an array of frame indices");
  }
  return validateFrames(values);
}

function validateFrames(values: unknown[]): number[] {
  if (
    values.length === 0 ||
    values.some((value) => !Number.isInteger(value) || Number(value) < 0)
  ) {
    throw new Error("--frames must contain one or more non-negative integers");
  }
  return values as number[];
}

export function parseOptionalInteger(
  value: string | number | undefined,
  flag: string,
  options: { min?: number; max?: number } = {},
): number | undefined {
  if (value === undefined) return undefined;
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(parsed)) throw new Error(`${flag} must be an integer`);
  if (options.min !== undefined && parsed < options.min) {
    throw new Error(`${flag} must be at least ${options.min}`);
  }
  if (options.max !== undefined && parsed > options.max) {
    throw new Error(`${flag} must be at most ${options.max}`);
  }
  return parsed;
}

export function parseOverlayPosition(
  value: string | undefined,
): "top" | "center" | "bottom" | undefined {
  if (value === undefined) return undefined;
  if (value !== "top" && value !== "center" && value !== "bottom") {
    throw new Error("--position must be top, center, or bottom");
  }
  return value;
}

export function parseJsonObject(
  value: string | Record<string, unknown> | undefined,
  flag: string,
): Record<string, unknown> | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "object" && value !== null && !Array.isArray(value)) return value;

  let parsed: unknown;
  try {
    parsed = JSON.parse(value as string);
  } catch {
    throw new Error(`${flag} must be a valid JSON object`);
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error(`${flag} must be a JSON object`);
  }
  return parsed as Record<string, unknown>;
}

export function buildExtractBody(args: {
  mediaUrl: string;
  frames?: string | number[];
  audio?: boolean;
  metadata?: boolean;
}): Record<string, unknown> {
  const body: Record<string, unknown> = { mediaUrl: args.mediaUrl };
  const frames = parseFrames(args.frames);
  if (frames !== undefined) body.frames = frames;
  if (args.audio !== undefined) body.audio = args.audio;
  if (args.metadata !== undefined) body.metadata = args.metadata;
  return body;
}

export function buildOverlayBody(args: {
  videoUrl: string;
  text: string;
  position?: string;
  fontSize?: string | number;
  strokeThickness?: string | number;
}): Record<string, unknown> {
  const body: Record<string, unknown> = { videoUrl: args.videoUrl, text: args.text };
  const position = parseOverlayPosition(args.position);
  const fontSize = parseOptionalInteger(args.fontSize, "--fontSize", { min: 1 });
  const strokeThickness = parseOptionalInteger(args.strokeThickness, "--strokeThickness", {
    min: 0,
    max: 10,
  });
  if (position !== undefined) body.position = position;
  if (fontSize !== undefined) body.fontSize = fontSize;
  if (strokeThickness !== undefined) body.strokeThickness = strokeThickness;
  return body;
}

export function validateSubscribeArgs(args: { email?: string; claim?: string }): void {
  if (!args.email && !args.claim) {
    throw new Error("Provide --email for a new checkout or --claim to resume polling.");
  }
}
