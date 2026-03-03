import type { ConversionOptions, ConversionResult } from "../types";

export function convertJsonToXml(
  jsonString: string,
  options: ConversionOptions,
): ConversionResult {
  try {
    const parsed = JSON.parse(jsonString);
    const lines: string[] = [];

    if (options.xmlDeclaration) {
      lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    }

    lines.push(
      valueToXml(parsed, options.rootElementName, 0, options.indent),
    );

    return { xml: lines.join("\n") };
  } catch (e) {
    if (e instanceof SyntaxError) {
      const match = e.message.match(/position\s+(\d+)/i);
      const pos = match ? ` (position ${match[1]})` : "";
      return { xml: "", error: `Invalid JSON${pos}: ${e.message}` };
    }
    return { xml: "", error: String(e) };
  }
}

function valueToXml(
  value: unknown,
  tagName: string,
  depth: number,
  indent: number,
): string {
  const pad = " ".repeat(depth * indent);

  if (value === null || value === undefined) {
    return `${pad}<${tagName} />`;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return `${pad}<${tagName}>${escapeXml(String(value))}</${tagName}>`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return `${pad}<${tagName} />`;
    }
    return value
      .map((item) => valueToXml(item, tagName, depth, indent))
      .join("\n");
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return `${pad}<${tagName} />`;
    }

    const children = entries
      .map(([key, val]) => {
        const safeTag = toSafeTagName(key);
        return valueToXml(val, safeTag, depth + 1, indent);
      })
      .join("\n");

    return `${pad}<${tagName}>\n${children}\n${pad}</${tagName}>`;
  }

  return `${pad}<${tagName}>${escapeXml(String(value))}</${tagName}>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toSafeTagName(key: string): string {
  let tag = key.replace(/[^a-zA-Z0-9_.-]/g, "_");
  if (!/^[a-zA-Z_]/.test(tag)) {
    tag = "_" + tag;
  }
  return tag;
}
