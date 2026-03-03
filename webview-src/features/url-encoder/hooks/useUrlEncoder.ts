import { useState, useCallback, useEffect, useRef } from "react";
import { processUrl, type UrlMode, type EncodeResult } from "../lib/encoder";

export function useUrlEncoder() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<EncodeResult | null>(null);
  const [mode, setMode] = useState<UrlMode>("encode");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const convert = useCallback(() => {
    if (!input.trim()) {
      setResult(null);
      return;
    }

    const res = processUrl(input, mode);
    setResult(res);

    if (res.error) {
    } else {
    }
  }, [input, mode]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (input.trim()) {
        convert();
      } else {
        setResult(null);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, mode, convert]);

  return { input, setInput, result, mode, setMode, convert };
}
