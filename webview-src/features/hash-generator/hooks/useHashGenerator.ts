import { useState, useEffect, useRef, useCallback } from "react";
import {
  generateAllHashes,
  textToArrayBuffer,
  type HashResult,
} from "../lib/hash";

export function useHashGenerator() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<HashResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const hashText = useCallback(async (text: string) => {
    if (!text.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    try {
      const buffer = await textToArrayBuffer(text);
      const hashResults = await generateAllHashes(buffer);
      setResults(hashResults);
      setError(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
      setResults([]);
    }
  }, []);

  const hashFile = useCallback(async (file: File) => {

    try {
      const buffer = await file.arrayBuffer();
      const hashResults = await generateAllHashes(buffer);
      setResults(hashResults);
      setError(null);
      setFileName(file.name);
      setInput("");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
      setResults([]);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (input.trim()) {
        setFileName(null);
        hashText(input);
      } else if (!fileName) {
        setResults([]);
        setError(null);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, hashText, fileName]);

  return { input, setInput, results, error, fileName, hashFile };
}
