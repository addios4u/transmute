// @vitest-environment node
import { describe, it, expect } from "vitest";
import { convertJsonToTs } from "./converter";
import { DEFAULT_OPTIONS } from "../types";

describe("convertJsonToTs", () => {
  it("converts basic object to TypeScript type", () => {
    const input = '{"id": 1, "name": "test"}';
    const result = convertJsonToTs(input, DEFAULT_OPTIONS);

    expect(result.error).toBeUndefined();
    expect(result.typescript).toContain("id: number");
    expect(result.typescript).toContain("name: string");
  });

  it("returns error for invalid JSON", () => {
    const result = convertJsonToTs("{invalid}", DEFAULT_OPTIONS);

    expect(result.error).toBeDefined();
    expect(result.typescript).toBe("");
  });

  it("applies rootTypeName option", () => {
    const input = '{"id": 1}';
    const result = convertJsonToTs(input, {
      ...DEFAULT_OPTIONS,
      rootTypeName: "User",
    });

    expect(result.typescript).toContain("User");
  });

  it("uses interface when useInterface is true", () => {
    const input = '{"id": 1}';
    const result = convertJsonToTs(input, {
      ...DEFAULT_OPTIONS,
      useInterface: true,
    });

    expect(result.typescript).toContain("export interface Root");
  });

  it("handles arrays", () => {
    const input = '{"tags": ["a", "b"]}';
    const result = convertJsonToTs(input, DEFAULT_OPTIONS);

    expect(result.typescript).toContain("tags: string[]");
  });

  it("handles nested objects", () => {
    const input = '{"user": {"name": "test", "age": 30}}';
    const result = convertJsonToTs(input, DEFAULT_OPTIONS);

    expect(result.typescript).toContain("user: User");
    expect(result.typescript).toContain("name: string");
    expect(result.typescript).toContain("age: number");
  });

  it("handles null values", () => {
    const input = '{"value": null}';
    const result = convertJsonToTs(input, DEFAULT_OPTIONS);

    expect(result.typescript).toContain("value: null");
  });

  it("handles empty arrays", () => {
    const input = '{"items": []}';
    const result = convertJsonToTs(input, DEFAULT_OPTIONS);

    expect(result.typescript).toContain("items: unknown[]");
  });
});
