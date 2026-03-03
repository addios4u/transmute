export type HashAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export const HASH_ALGORITHMS: HashAlgorithm[] = [
  "SHA-1",
  "SHA-256",
  "SHA-384",
  "SHA-512",
];

export interface HashResult {
  algorithm: HashAlgorithm;
  hash: string;
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function generateHash(
  data: ArrayBuffer,
  algorithm: HashAlgorithm,
): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  return bufferToHex(hashBuffer);
}

export async function generateAllHashes(
  data: ArrayBuffer,
): Promise<HashResult[]> {
  const results = await Promise.all(
    HASH_ALGORITHMS.map(async (algorithm) => ({
      algorithm,
      hash: await generateHash(data, algorithm),
    })),
  );
  return results;
}

export async function textToArrayBuffer(text: string): Promise<ArrayBuffer> {
  return new TextEncoder().encode(text).buffer as ArrayBuffer;
}
