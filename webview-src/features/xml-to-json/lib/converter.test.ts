// @vitest-environment node
import { describe, it, expect } from "vitest";
import { convertXmlToJson } from "./converter";
import { DEFAULT_OPTIONS } from "../types";
import type { ConversionOptions } from "../types";

function convert(xml: string, opts?: Partial<ConversionOptions>) {
  return convertXmlToJson(xml, { ...DEFAULT_OPTIONS, ...opts });
}

function parseResult(xml: string) {
  const result = convert(xml);
  expect(result.error).toBeUndefined();
  return JSON.parse(result.json);
}

describe("convertXmlToJson", () => {
  it("converts a simple element", () => {
    const obj = parseResult("<root><name>Alice</name><age>30</age></root>");
    expect(obj.root.name).toBe("Alice");
    expect(obj.root.age).toBe("30");
  });

  it("handles nested elements", () => {
    const obj = parseResult(
      "<root><user><name>Bob</name><address><city>Seoul</city></address></user></root>",
    );
    expect(obj.root.user.name).toBe("Bob");
    expect(obj.root.user.address.city).toBe("Seoul");
  });

  it("handles repeated elements as arrays", () => {
    const obj = parseResult(
      "<root><item>1</item><item>2</item><item>3</item></root>",
    );
    expect(obj.root.item).toEqual(["1", "2", "3"]);
  });

  it("handles attributes", () => {
    const obj = parseResult('<root><user id="1" role="admin">Alice</user></root>');
    expect(obj.root.user["@id"]).toBe("1");
    expect(obj.root.user["@role"]).toBe("admin");
    expect(obj.root.user["#text"]).toBe("Alice");
  });

  it("handles empty elements", () => {
    const obj = parseResult("<root><empty /></root>");
    expect(obj.root.empty).toBeNull();
  });

  it("handles XML declaration", () => {
    const obj = parseResult(
      '<?xml version="1.0" encoding="UTF-8"?><root><a>1</a></root>',
    );
    expect(obj.root.a).toBe("1");
  });

  it("returns error for invalid XML", () => {
    const result = convert("<root><unclosed>");
    expect(result.error).toBeTruthy();
    expect(result.json).toBe("");
  });

  it("respects indent option", () => {
    const result = convert("<root><a>1</a></root>", { indent: 4 });
    expect(result.error).toBeUndefined();
    expect(result.json).toContain("    ");
  });

  it("handles text-only root", () => {
    const obj = parseResult("<message>Hello World</message>");
    expect(obj.message).toBe("Hello World");
  });
});
