import { useState, useCallback } from "react";
import { renderAllThumbnails } from "@/shared/lib/pdf-renderer";
import {
  getPageCount,
  parsePageRange,
  extractPages,
  splitToIndividualPages,
  createZip,
  downloadBlob,
} from "../lib/splitter";
import { type SplitOptions, DEFAULT_OPTIONS } from "../types";

export function usePdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [options, setOptions] = useState<SplitOptions>(DEFAULT_OPTIONS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback(async (newFile: File) => {
    const isPdf =
      newFile.type === "application/pdf" ||
      newFile.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) return;

    try {
      const pageCount = await getPageCount(newFile);
      setFile(newFile);
      setFileName(newFile.name);
      setTotalPages(pageCount);
      setOptions({ ...DEFAULT_OPTIONS, pageRange: `1-${pageCount}` });
      setError(null);

      // Render thumbnails in background
      try {
        const arrayBuffer = await newFile.arrayBuffer();
        const thumbs = await renderAllThumbnails(arrayBuffer);
        setThumbnails(thumbs);
      } catch (e) {
        console.error("[pdf-split] thumbnail rendering failed:", e);
        setThumbnails([]);
      }
    } catch {
      setError("Failed to load PDF file");
    }
  }, []);

  const split = useCallback(async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      if (options.mode === "range") {
        const pages = parsePageRange(options.pageRange, totalPages);
        if (pages.length === 0) {
          setError("No valid pages selected");
          setIsProcessing(false);
          return;
        }
        const blob = await extractPages(file, pages);
        const baseName = fileName.replace(/\.pdf$/i, "");
        downloadBlob(blob, `${baseName}_extracted.pdf`);
      } else {
        const results = await splitToIndividualPages(file);
        const zipBlob = await createZip(results);
        const baseName = fileName.replace(/\.pdf$/i, "");
        downloadBlob(zipBlob, `${baseName}_split.zip`);
      }
    } catch {
      setError("Failed to split PDF file");
    }

    setIsProcessing(false);
  }, [file, fileName, options, totalPages]);

  const clear = useCallback(() => {
    setFile(null);
    setFileName("");
    setTotalPages(0);
    setThumbnails([]);
    setOptions(DEFAULT_OPTIONS);
    setError(null);
  }, []);

  return {
    file,
    fileName,
    totalPages,
    thumbnails,
    options,
    setOptions,
    isProcessing,
    error,
    loadFile,
    split,
    clear,
  };
}
