function sanitize(input: string): string {
  return input.trim().replace(/^["'`]+|["'`]+$/g, "").trim();
}

export function isValidBase64Image(input: string): boolean {
  const cleaned = sanitize(input);

  // data URL format
  if (cleaned.startsWith("data:image/")) {
    return true;
  }

  // raw base64 - try to detect if it's valid
  try {
    atob(cleaned.slice(0, 100));
    return cleaned.length > 0;
  } catch {
    return false;
  }
}

export function toDataUrl(input: string): string {
  const cleaned = sanitize(input);
  if (cleaned.startsWith("data:")) return cleaned;
  return `data:image/png;base64,${cleaned}`;
}
