export interface JwtDecodeResult {
  header: string;
  payload: string;
  signature: string;
  expiresAt: string | null;
  isExpired: boolean | null;
  error: string | null;
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad) {
    base64 += "=".repeat(4 - pad);
  }
  try {
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
  } catch {
    return atob(base64);
  }
}

function formatJson(json: string): string {
  try {
    return JSON.stringify(JSON.parse(json), null, 2);
  } catch {
    return json;
  }
}

function parseExpiration(payloadJson: string): {
  expiresAt: string | null;
  isExpired: boolean | null;
} {
  try {
    const parsed = JSON.parse(payloadJson);
    if (typeof parsed.exp === "number") {
      const expDate = new Date(parsed.exp * 1000);
      const now = new Date();
      return {
        expiresAt: expDate.toISOString(),
        isExpired: now > expDate,
      };
    }
  } catch {
    // ignore
  }
  return { expiresAt: null, isExpired: null };
}

export function decodeJwt(token: string): JwtDecodeResult {
  const trimmed = token.trim();

  if (!trimmed) {
    return {
      header: "",
      payload: "",
      signature: "",
      expiresAt: null,
      isExpired: null,
      error: null,
    };
  }

  const parts = trimmed.split(".");

  if (parts.length !== 3) {
    return {
      header: "",
      payload: "",
      signature: "",
      expiresAt: null,
      isExpired: null,
      error: "invalid_jwt_format",
    };
  }

  const [headerPart, payloadPart, signaturePart] = parts as [string, string, string];

  try {
    const headerJson = base64UrlDecode(headerPart);
    const payloadJson = base64UrlDecode(payloadPart);

    // Validate that header and payload are valid JSON
    JSON.parse(headerJson);
    JSON.parse(payloadJson);

    const { expiresAt, isExpired } = parseExpiration(payloadJson);

    return {
      header: formatJson(headerJson),
      payload: formatJson(payloadJson),
      signature: signaturePart,
      expiresAt,
      isExpired,
      error: null,
    };
  } catch {
    return {
      header: "",
      payload: "",
      signature: "",
      expiresAt: null,
      isExpired: null,
      error: "invalid_jwt_content",
    };
  }
}
