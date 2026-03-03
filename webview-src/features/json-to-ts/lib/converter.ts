import type { ConversionOptions } from "../types";

export interface ConversionResult {
  typescript: string;
  error?: string;
}

export function convertJsonToTs(jsonString: string, options: ConversionOptions): ConversionResult {
  try {
    const parsed = JSON.parse(jsonString);
    const typescript = generateTypes(parsed, options.rootTypeName, options);
    return { typescript };
  } catch (e) {
    if (e instanceof SyntaxError) {
      return { typescript: "", error: e.message };
    }
    return { typescript: "", error: "Unknown error" };
  }
}

function generateTypes(
  value: unknown,
  name: string,
  options: ConversionOptions,
  indent: number = 0,
): string {
  const nestedTypes: string[] = [];
  const typeStr = inferType(value, name, options, nestedTypes, indent);

  const keyword = options.useInterface ? "interface" : "type";
  const assignment = options.useInterface ? "" : " =";

  const mainType =
    typeof value === "object" && value !== null && !Array.isArray(value)
      ? `export ${keyword} ${name}${assignment} ${typeStr};`
      : `export type ${name} = ${typeStr};`;

  return [...nestedTypes, mainType].join("\n\n");
}

function inferType(
  value: unknown,
  context: string,
  options: ConversionOptions,
  nestedTypes: string[],
  indent: number,
): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";

  switch (typeof value) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "object":
      if (Array.isArray(value)) {
        return inferArrayType(value, context, options, nestedTypes, indent);
      }
      return inferObjectType(value as Record<string, unknown>, context, options, nestedTypes, indent);
    default:
      return "unknown";
  }
}

function inferArrayType(
  arr: unknown[],
  context: string,
  options: ConversionOptions,
  nestedTypes: string[],
  indent: number,
): string {
  if (arr.length === 0) return "unknown[]";

  if (options.arrayInference === "first") {
    const itemType = inferType(arr[0], singularize(context), options, nestedTypes, indent);
    return `${wrapIfComplex(itemType)}[]`;
  }

  // merge all elements
  const types = new Set<string>();
  for (const item of arr) {
    types.add(inferType(item, singularize(context), options, nestedTypes, indent));
  }

  if (types.size === 1) {
    const type = [...types][0]!;
    return `${wrapIfComplex(type)}[]`;
  }

  return `(${[...types].join(" | ")})[]`;
}

function inferObjectType(
  obj: Record<string, unknown>,
  _context: string,
  options: ConversionOptions,
  nestedTypes: string[],
  indent: number,
): string {
  const entries = Object.entries(obj);
  if (entries.length === 0) return "Record<string, unknown>";

  const pad = "  ".repeat(indent + 1);
  const lines = entries.map(([key, val]) => {
    const nestedName = capitalize(key);

    if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      const keyword = options.useInterface ? "interface" : "type";
      const assignment = options.useInterface ? "" : " =";
      const nested = inferObjectType(
        val as Record<string, unknown>,
        nestedName,
        options,
        nestedTypes,
        0,
      );
      nestedTypes.push(`export ${keyword} ${nestedName}${assignment} ${nested};`);
      return `${pad}${safePropName(key)}: ${nestedName};`;
    }

    const typeStr = inferType(val, key, options, nestedTypes, indent + 1);
    return `${pad}${safePropName(key)}: ${typeStr};`;
  });

  return `{\n${lines.join("\n")}\n${"  ".repeat(indent)}}`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function singularize(s: string): string {
  return s.endsWith("s") ? s.slice(0, -1) : s;
}

function safePropName(key: string): string {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
}

function wrapIfComplex(type: string): string {
  return type.includes("|") ? `(${type})` : type;
}
