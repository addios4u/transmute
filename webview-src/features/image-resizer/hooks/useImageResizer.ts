import { useState, useCallback } from "react";
import { loadImageFromFile } from "@/features/image-converter/lib/converter";
import { processFile, createZip, downloadBlob, extractImagesFromZip } from "../lib/resizer";
import { type ResizeOptions, type ResizeFileItem, DEFAULT_OPTIONS } from "../types";

export function useImageResizer() {
  const [files, setFiles] = useState<ResizeFileItem[]>([]);
  const [options, setOptions] = useState<ResizeOptions>(DEFAULT_OPTIONS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback(async (newFiles: File[]) => {
    // Extract images from ZIP files
    const zipFiles = newFiles.filter(
      (f) => f.type === "application/zip" || f.type === "application/x-zip-compressed" || f.name.endsWith(".zip"),
    );
    const extractedFromZip = (
      await Promise.all(zipFiles.map((z) => extractImagesFromZip(z)))
    ).flat();

    const imageFiles = [
      ...newFiles.filter((f) => f.type.startsWith("image/")),
      ...extractedFromZip,
    ];
    if (imageFiles.length === 0) return;

    const items: ResizeFileItem[] = await Promise.all(
      imageFiles.map(async (file) => {
        const img = await loadImageFromFile(file);
        return {
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
          originalWidth: img.naturalWidth,
          originalHeight: img.naturalHeight,
          status: "pending" as const,
        };
      }),
    );

    setFiles((prev) => [...prev, ...items]);
    setError(null);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const processAll = useCallback(async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setProgress({ current: 0, total: files.length });

    // Reset all statuses to pending
    setFiles((prev) => prev.map((f) => ({ ...f, status: "pending" as const, result: undefined })));

    const results: ResizeFileItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const item = files[i]!;
      const itemId = item.id;

      setFiles((prev) =>
        prev.map((f) =>
          f.id === itemId ? { ...f, status: "processing" as const } : f,
        ),
      );

      try {
        const result = await processFile(item.file, options);
        const updatedItem: ResizeFileItem = { ...item, status: "done", result };
        results.push(updatedItem);

        setFiles((prev) =>
          prev.map((f) => (f.id === itemId ? updatedItem : f)),
        );
      } catch {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === itemId ? { ...f, status: "error" as const } : f,
          ),
        );
      }

      setProgress({ current: i + 1, total: files.length });
    }

    // Create and download ZIP
    const successResults = results
      .filter((r) => r.result)
      .map((r) => r.result!);

    if (successResults.length > 0) {
      try {
        const zipBlob = await createZip(successResults);
        downloadBlob(zipBlob, "resized-images.zip");
      } catch {
        setError("Failed to create ZIP file");
      }
    }

    setIsProcessing(false);
  }, [files, options]);

  const clear = useCallback(() => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setError(null);
    setProgress({ current: 0, total: 0 });
    setOptions(DEFAULT_OPTIONS);
  }, [files]);

  return {
    files,
    options,
    setOptions,
    isProcessing,
    progress,
    error,
    addFiles,
    removeFile,
    processAll,
    clear,
  };
}
