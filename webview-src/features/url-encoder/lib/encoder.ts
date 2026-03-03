export type UrlMode = "encode" | "decode";

export interface EncodeResult {
  output: string;
  error?: string;
}

export function encodeUrl(input: string): EncodeResult {
  try {
    return { output: encodeURIComponent(input) };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { output: "", error: message };
  }
}

export function decodeUrl(input: string): EncodeResult {
  try {
    return { output: decodeURIComponent(input) };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { output: "", error: message };
  }
}

export function processUrl(input: string, mode: UrlMode): EncodeResult {
  if (mode === "encode") {
    return encodeUrl(input);
  }
  return decodeUrl(input);
}
