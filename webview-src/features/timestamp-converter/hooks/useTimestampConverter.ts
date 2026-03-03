import { useState, useEffect, useCallback, useRef } from "react";
import {
  timestampToDate,
  dateToTimestamp,
  type TimestampResult,
} from "../lib/timestamp";

export type ConvertMode = "toDate" | "toTimestamp";

export function useTimestampConverter() {
  const [mode, setMode] = useState<ConvertMode>("toDate");
  const [timestampInput, setTimestampInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [result, setResult] = useState<TimestampResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<TimestampResult | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Live clock
  useEffect(() => {
    const update = () => setCurrentTime(dateToTimestamp(new Date()));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const convertTimestamp = useCallback(() => {
    if (!timestampInput.trim()) {
      setResult(null);
      setError(null);
      return;
    }

    const res = timestampToDate(timestampInput);
    if (res) {
      setResult(res);
      setError(null);
    } else {
      setResult(null);
      setError("Invalid timestamp");
    }
  }, [timestampInput]);

  const convertDate = useCallback(() => {
    if (!dateInput.trim()) {
      setResult(null);
      setError(null);
      return;
    }

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      setResult(null);
      setError("Invalid date");
      return;
    }

    setResult(dateToTimestamp(date));
    setError(null);
  }, [dateInput]);

  // Debounced conversion
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (mode === "toDate") {
        convertTimestamp();
      } else {
        convertDate();
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [timestampInput, dateInput, mode, convertTimestamp, convertDate]);

  return {
    mode,
    setMode,
    timestampInput,
    setTimestampInput,
    dateInput,
    setDateInput,
    result,
    error,
    currentTime,
  };
}
