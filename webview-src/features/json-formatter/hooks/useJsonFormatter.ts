import { useState, useCallback, useEffect, useRef } from "react";
import { formatJson, minifyJson, type IndentType, type FormatResult } from "../lib/formatter";

export function useJsonFormatter() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<FormatResult | null>(null);
  const [indent, setIndent] = useState<IndentType>("2");
  const [mode, setMode] = useState<"format" | "minify">("format");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const convert = useCallback(() => {
    if (!input.trim()) {
      setResult(null);
      return;
    }

    const res = mode === "format" ? formatJson(input, indent) : minifyJson(input);
    setResult(res);

    if (res.error) {
    } else {
    }
  }, [input, indent, mode]);

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
  }, [input, indent, mode, convert]);

  return { input, setInput, result, indent, setIndent, mode, setMode, convert };
}
