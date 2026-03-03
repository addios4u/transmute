import { useState, useCallback } from "react";
import { encodeImageToBase64, type EncodeResult } from "../lib/encoder";

export function useImageToBase64() {
  const [result, setResult] = useState<EncodeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Not an image file");
      return;
    }

    try {
      const encoded = await encodeImageToBase64(file);
      setResult(encoded);
      setError(null);
    } catch {
      setError("Failed to encode image");
    }
  }, []);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, error, handleFile, clear };
}
