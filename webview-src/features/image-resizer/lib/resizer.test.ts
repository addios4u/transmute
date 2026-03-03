// @vitest-environment node
import { describe, it, expect } from "vitest";
import { calculateDimensions } from "./resizer";
import type { ResizeOptions } from "../types";
import { DEFAULT_OPTIONS } from "../types";

function makeOptions(overrides: Partial<ResizeOptions>): ResizeOptions {
  return { ...DEFAULT_OPTIONS, ...overrides };
}

describe("calculateDimensions - ratio mode", () => {
  it("should scale down by 50%", () => {
    const result = calculateDimensions(
      1000,
      800,
      makeOptions({ mode: "ratio", ratio: 0.5 }),
    );
    expect(result).toEqual({ width: 500, height: 400 });
  });

  it("should scale down by 25%", () => {
    const result = calculateDimensions(
      1920,
      1080,
      makeOptions({ mode: "ratio", ratio: 0.25 }),
    );
    expect(result).toEqual({ width: 480, height: 270 });
  });

  it("should handle 100% (no change)", () => {
    const result = calculateDimensions(
      800,
      600,
      makeOptions({ mode: "ratio", ratio: 1.0 }),
    );
    expect(result).toEqual({ width: 800, height: 600 });
  });

  it("should round to nearest integer", () => {
    const result = calculateDimensions(
      1001,
      801,
      makeOptions({ mode: "ratio", ratio: 0.5 }),
    );
    expect(result).toEqual({ width: 501, height: 401 });
  });
});

describe("calculateDimensions - maxDimension mode", () => {
  it("should scale down a wide image to fit maxWidth", () => {
    const result = calculateDimensions(
      3840,
      2160,
      makeOptions({ mode: "maxDimension", maxWidth: 1920, maxHeight: 1080 }),
    );
    expect(result).toEqual({ width: 1920, height: 1080 });
  });

  it("should scale down a tall image to fit maxHeight", () => {
    const result = calculateDimensions(
      1000,
      4000,
      makeOptions({ mode: "maxDimension", maxWidth: 1920, maxHeight: 1080 }),
    );
    expect(result).toEqual({ width: 270, height: 1080 });
  });

  it("should not upscale a small image", () => {
    const result = calculateDimensions(
      640,
      480,
      makeOptions({ mode: "maxDimension", maxWidth: 1920, maxHeight: 1080 }),
    );
    expect(result).toEqual({ width: 640, height: 480 });
  });

  it("should handle image that only exceeds width", () => {
    const result = calculateDimensions(
      2400,
      600,
      makeOptions({ mode: "maxDimension", maxWidth: 1200, maxHeight: 1200 }),
    );
    expect(result).toEqual({ width: 1200, height: 300 });
  });
});
