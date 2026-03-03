// @vitest-environment node
import { describe, it, expect } from "vitest";
import { convertJsonToXml } from "./converter";
import { DEFAULT_OPTIONS } from "../types";
import type { ConversionOptions } from "../types";

function convert(json: string, opts?: Partial<ConversionOptions>) {
  return convertJsonToXml(json, { ...DEFAULT_OPTIONS, ...opts });
}

describe("convertJsonToXml", () => {
  it("converts a simple object", () => {
    const result = convert('{"name":"Alice","age":30}');
    expect(result.error).toBeUndefined();
    expect(result.xml).toContain("<name>Alice</name>");
    expect(result.xml).toContain("<age>30</age>");
  });

  it("includes XML declaration by default", () => {
    const result = convert('{"a":1}');
    expect(result.xml).toMatch(/^<\?xml version="1\.0"/);
  });

  it("omits XML declaration when disabled", () => {
    const result = convert('{"a":1}', { xmlDeclaration: false });
    expect(result.xml).not.toContain("<?xml");
  });

  it("uses custom root element name", () => {
    const result = convert('{"a":1}', { rootElementName: "data" });
    expect(result.xml).toContain("<data>");
    expect(result.xml).toContain("</data>");
  });

  it("handles nested objects", () => {
    const result = convert('{"user":{"name":"Bob","address":{"city":"Seoul"}}}');
    expect(result.error).toBeUndefined();
    expect(result.xml).toContain("<user>");
    expect(result.xml).toContain("<city>Seoul</city>");
  });

  it("handles arrays", () => {
    const result = convert('{"items":[1,2,3]}');
    expect(result.error).toBeUndefined();
    expect(result.xml).toContain("<items>1</items>");
    expect(result.xml).toContain("<items>2</items>");
    expect(result.xml).toContain("<items>3</items>");
  });

  it("handles null values", () => {
    const result = convert('{"value":null}');
    expect(result.error).toBeUndefined();
    expect(result.xml).toContain("<value />");
  });

  it("handles boolean values", () => {
    const result = convert('{"active":true,"deleted":false}');
    expect(result.xml).toContain("<active>true</active>");
    expect(result.xml).toContain("<deleted>false</deleted>");
  });

  it("escapes special XML characters", () => {
    const result = convert('{"text":"<hello> & \\"world\\""}');
    expect(result.xml).toContain("&lt;hello&gt; &amp; &quot;world&quot;");
  });

  it("handles empty objects", () => {
    const result = convert('{"empty":{}}');
    expect(result.xml).toContain("<empty />");
  });

  it("handles empty arrays", () => {
    const result = convert('{"items":[]}');
    expect(result.xml).toContain("<items />");
  });

  it("sanitizes invalid tag names", () => {
    const result = convert('{"123key":"val","a b":"val2"}');
    expect(result.xml).toContain("<_123key>val</_123key>");
    expect(result.xml).toContain("<a_b>val2</a_b>");
  });

  it("returns error for invalid JSON", () => {
    const result = convert("not json");
    expect(result.error).toBeTruthy();
    expect(result.xml).toBe("");
  });
});
