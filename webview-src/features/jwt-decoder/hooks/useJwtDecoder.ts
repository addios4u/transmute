import { useState, useEffect, useRef } from "react";
import { decodeJwt, type JwtDecodeResult } from "../lib/decoder";

export function useJwtDecoder() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<JwtDecodeResult | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!input.trim()) {
        setResult(null);
        return;
      }

      const decoded = decodeJwt(input);
      setResult(decoded);

      if (decoded.error) {
      } else {
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

  return { input, setInput, result };
}
