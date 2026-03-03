import { useState, useEffect, useRef } from "react";
import {
  csvToJson,
  jsonToCsv,
  type Delimiter,
  type CsvJsonResult,
} from "../lib/converter";

export type ConvertMode = "csv-to-json" | "json-to-csv";

export function useCsvJson() {
  const [mode, setMode] = useState<ConvertMode>("csv-to-json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [delimiter, setDelimiter] = useState<Delimiter>(",");
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!input.trim()) {
        setOutput("");
        setError(null);
        return;
      }

      let result: CsvJsonResult;
      if (mode === "csv-to-json") {
        result = csvToJson(input, delimiter);
      } else {
        result = jsonToCsv(input, delimiter);
      }

      setOutput(result.output);
      setError(result.error);

      if (result.error) {
      } else {
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, mode, delimiter]);

  const switchMode = () => {
    setMode((prev) =>
      prev === "csv-to-json" ? "json-to-csv" : "csv-to-json",
    );
    setInput(output);
    setOutput("");
    setError(null);
  };

  return {
    mode,
    setMode: switchMode,
    input,
    setInput,
    output,
    delimiter,
    setDelimiter,
    error,
  };
}
