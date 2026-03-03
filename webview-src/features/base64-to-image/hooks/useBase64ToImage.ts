import { useState, useCallback, useEffect, useRef } from "react";
import { isValidBase64Image, toDataUrl } from "../lib/decoder";

export function useBase64ToImage() {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const convert = useCallback(() => {
    if (!input.trim()) {
      setImageUrl(null);
      setError(null);
      return;
    }

    if (!isValidBase64Image(input)) {
      setError("Invalid Base64 image string");
      setImageUrl(null);
      return;
    }

    setImageUrl(toDataUrl(input));
    setError(null);
  }, [input]);

  // Auto-convert with debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (input.trim()) {
        convert();
      } else {
        setImageUrl(null);
        setError(null);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, convert]);

  const download = useCallback(() => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "image.png";
    link.click();
  }, [imageUrl]);

  return { input, setInput, imageUrl, error, convert, download };
}
