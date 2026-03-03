import { useState, useCallback } from "react";
import { processImageConversion } from "../lib/converter";
import {
  type ConversionOptions,
  type ConversionResult,
  DEFAULT_OPTIONS,
} from "../types";

export function useImageConverter() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [options, setOptions] = useState<ConversionOptions>(DEFAULT_OPTIONS);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Not an image file");
      return;
    }
    setSourceFile(file);
    setSourcePreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  }, []);

  const convert = useCallback(async () => {
    if (!sourceFile) return;

    setIsConverting(true);
    setError(null);

    try {
      const conversionResult = await processImageConversion(
        sourceFile,
        options.outputFormat,
        options.quality,
      );
      setResult(conversionResult);
    } catch {
      setError("Failed to convert image");
    } finally {
      setIsConverting(false);
    }
  }, [sourceFile, options]);

  const download = useCallback(() => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result.dataUrl;
    link.download = result.fileName;
    link.click();
  }, [result]);

  const clear = useCallback(() => {
    if (sourcePreview) URL.revokeObjectURL(sourcePreview);
    setSourceFile(null);
    setSourcePreview(null);
    setResult(null);
    setError(null);
    setOptions(DEFAULT_OPTIONS);
  }, [sourcePreview]);

  return {
    sourceFile,
    sourcePreview,
    options,
    setOptions,
    result,
    error,
    isConverting,
    handleFile,
    convert,
    download,
    clear,
  };
}
