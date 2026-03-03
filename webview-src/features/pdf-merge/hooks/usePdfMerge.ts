import { useState, useCallback } from "react";
import { renderPageThumbnail } from "@/shared/lib/pdf-renderer";
import { getPageCount, mergePDFs, downloadBlob } from "../lib/merger";
import type { PdfFileItem } from "../types";

export function usePdfMerge() {
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback(async (newFiles: File[]) => {
    const pdfFiles = newFiles.filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"),
    );
    if (pdfFiles.length === 0) return;

    const items: PdfFileItem[] = await Promise.all(
      pdfFiles.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const pageCount = await getPageCount(file);
        let thumbnail = "";
        try {
          thumbnail = await renderPageThumbnail(arrayBuffer, 1);
        } catch {
          // Thumbnail rendering failed, use empty string
        }
        return {
          id: crypto.randomUUID(),
          file,
          fileName: file.name,
          fileSize: file.size,
          pageCount,
          thumbnail,
        };
      }),
    );

    setFiles((prev) => [...prev, ...items]);
    setError(null);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const moveFile = useCallback((id: string, direction: "up" | "down") => {
    setFiles((prev) => {
      const index = prev.findIndex((f) => f.id === id);
      if (index < 0) return prev;

      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const next = [...prev];
      [next[index], next[newIndex]] = [next[newIndex]!, next[index]!];
      return next;
    });
  }, []);

  const merge = useCallback(async () => {
    if (files.length < 2) return;

    setIsProcessing(true);
    setError(null);

    try {
      const mergedBlob = await mergePDFs(files.map((f) => f.file));
      downloadBlob(mergedBlob, "merged.pdf");
    } catch {
      setError("Failed to merge PDF files");
    }

    setIsProcessing(false);
  }, [files]);

  const clear = useCallback(() => {
    setFiles([]);
    setError(null);
  }, []);

  return {
    files,
    isProcessing,
    error,
    addFiles,
    removeFile,
    moveFile,
    merge,
    clear,
  };
}
