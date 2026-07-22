import { describe, expect, test } from "bun:test";
import {
  buildExtractBody,
  buildOverlayBody,
  parseFrames,
  parseJsonObject,
  parseOptionalInteger,
  parseOverlayPosition,
  validateSubscribeArgs,
} from "../src/command-args";

describe("extract arguments", () => {
  test("parses frame selectors and integer lists", () => {
    expect(parseFrames("auto")).toBe("auto");
    expect(parseFrames("last")).toBe("last");
    expect(parseFrames("[0, 75, 150]")).toEqual([0, 75, 150]);
    expect(parseFrames("0,75,150")).toEqual([0, 75, 150]);
    expect(() => parseFrames("[0, -1]")).toThrow("non-negative integers");
  });

  test("keeps booleans as booleans in the request", () => {
    expect(buildExtractBody({
      mediaUrl: "https://cdn.example/video.mp4",
      frames: "[0]",
      audio: true,
      metadata: false,
    })).toEqual({
      mediaUrl: "https://cdn.example/video.mp4",
      frames: [0],
      audio: true,
      metadata: false,
    });
  });
});

describe("overlay arguments", () => {
  test("parses integers and the position enum", () => {
    expect(parseOptionalInteger("42", "--size")).toBe(42);
    expect(parseOverlayPosition("bottom")).toBe("bottom");
    expect(buildOverlayBody({
      videoUrl: "https://cdn.example/video.mp4",
      text: "hello",
      position: "top",
      fontSize: "48",
      strokeThickness: "3",
    })).toEqual({
      videoUrl: "https://cdn.example/video.mp4",
      text: "hello",
      position: "top",
      fontSize: 48,
      strokeThickness: 3,
    });
  });

  test("rejects invalid values", () => {
    expect(() => parseOverlayPosition("left")).toThrow("top, center, or bottom");
    expect(() => parseOptionalInteger("1.5", "--size")).toThrow("integer");
    expect(() => buildOverlayBody({
      videoUrl: "https://cdn.example/video.mp4",
      text: "hello",
      strokeThickness: "11",
    })).toThrow("at most 10");
  });
});

describe("JSON metadata", () => {
  test("parses an object", () => {
    expect(parseJsonObject('{"campaign":"summer"}', "--metadata")).toEqual({
      campaign: "summer",
    });
  });

  test("rejects scalars and arrays", () => {
    expect(() => parseJsonObject("[]", "--metadata")).toThrow("JSON object");
    expect(() => parseJsonObject("nope", "--metadata")).toThrow("valid JSON object");
  });
});

describe("subscription arguments", () => {
  test("allows claim-only resume and requires one mode", () => {
    expect(validateSubscribeArgs({ claim: "claim_123" })).toBeUndefined();
    expect(validateSubscribeArgs({ email: "person@example.com" })).toBeUndefined();
    expect(() => validateSubscribeArgs({})).toThrow("--email");
  });
});
