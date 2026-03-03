import { useState, useCallback, useEffect, useRef } from "react";
import { convertJsonToXml } from "../lib/converter";
import { DEFAULT_OPTIONS } from "../types";
import type { ConversionOptions, ConversionResult } from "../types";

export function useJsonToXml() {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<ConversionOptions>(DEFAULT_OPTIONS);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const convert = useCallback(() => {
    if (!input.trim()) {
      setResult(null);
      return;
    }

    const conversionResult = convertJsonToXml(input, options);
    setResult(conversionResult);

    if (conversionResult.error) {
    } else {
    }
  }, [input, options]);

  // Auto-convert with debounce
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
  }, [input, options, convert]);

  return { input, setInput, options, setOptions, result, convert };
}
