export type IndentType = "2" | "4" | "tab";

export interface FormatResult {
  output: string;
  error?: string;
}

function getIndent(type: IndentType): string | number {
  switch (type) {
    case "2":
      return 2;
    case "4":
      return 4;
    case "tab":
      return "\t";
  }
}

export function formatJson(input: string, indent: IndentType): FormatResult {
  try {
    const parsed = JSON.parse(input);
    return { output: JSON.stringify(parsed, null, getIndent(indent)) };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { output: "", error: message };
  }
}

export function minifyJson(input: string): FormatResult {
  try {
    const parsed = JSON.parse(input);
    return { output: JSON.stringify(parsed) };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { output: "", error: message };
  }
}

export function validateJson(input: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { valid: false, error: message };
  }
}
