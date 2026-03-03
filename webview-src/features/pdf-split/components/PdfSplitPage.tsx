import { useState, useMemo, type DragEvent } from "react";
import { useTranslation } from "react-i18next";
import { usePdfSplit } from "../hooks/usePdfSplit";
import { parsePageRange } from "../lib/splitter";
import type { SplitMode } from "../types";
import { openFileDialog } from "@/vscode-api";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function PdfSplitPage() {
  const { t } = useTranslation("pdf-split");
  const { t: tc } = useTranslation();
  const {
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
  } = usePdfSplit();
  const [isDragging, setIsDragging] = useState(false);

  const onClickUpload = async () => {
    const files = await openFileDialog({ 'PDF': ['pdf'] }, false);
    if (files[0]) loadFile(files[0]);
  };

  const selectedPages = useMemo(() => {
    if (options.mode === "individual") {
      return new Set(Array.from({ length: totalPages }, (_, i) => i + 1));
    }
    return new Set(parsePageRange(options.pageRange, totalPages));
  }, [options.mode, options.pageRange, totalPages]);

  const togglePage = (pageNum: number) => {
    if (options.mode !== "range") return;

    const current = parsePageRange(options.pageRange, totalPages);
    const pageSet = new Set(current);

    if (pageSet.has(pageNum)) {
      pageSet.delete(pageNum);
    } else {
      pageSet.add(pageNum);
    }

    const sorted = Array.from(pageSet).sort((a, b) => a - b);
    // Compress to ranges
    const parts: string[] = [];
    let i = 0;
    while (i < sorted.length) {
      const start = sorted[i]!;
      let end = start;
      while (i + 1 < sorted.length && sorted[i + 1] === end + 1) {
        end = sorted[++i]!;
      }
      parts.push(start === end ? `${start}` : `${start}-${end}`);
      i++;
    }
    setOptions({ ...options, pageRange: parts.join(", ") });
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles[0]) loadFile(droppedFiles[0]);
  };


  const modes: { value: SplitMode; label: string }[] = [
    { value: "range", label: t("options.range") },
    { value: "individual", label: t("options.individual") },
  ];

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("description")}</p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={onClickUpload}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all duration-200 ${
          isDragging
            ? "border-accent bg-accent/5 scale-[1.01]"
            : "border-border/50 hover:border-accent/50 hover:bg-bg-secondary/50"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-text-tertiary"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="text-sm text-text-secondary">{t("dropzone")}</p>
      </div>

      {/* Loaded file info */}
      {file && (
        <>
          <div className="flex items-center justify-between rounded-lg border border-border/50 bg-bg-secondary/50 px-4 py-3">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 shrink-0 text-error/70"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <div>
                <p className="text-sm font-medium text-text-primary">{fileName}</p>
                <p className="text-xs text-text-tertiary">
                  {t("totalPages", { count: totalPages })} · {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <button
              onClick={clear}
              disabled={isProcessing}
              className="rounded-md border border-border px-3 py-1.5 text-sm text-text-secondary transition-all duration-200 hover:bg-bg-tertiary active:scale-95 disabled:opacity-50"
            >
              {tc("action.clear")}
            </button>
          </div>

          {/* Split options */}
          <div className="rounded-lg border border-border/50 bg-bg-secondary/30 p-4">
            <div className="flex flex-col gap-3">
              {/* Mode selector */}
              <div className="flex gap-2">
                {modes.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setOptions({ ...options, mode: mode.value })}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      options.mode === mode.value
                        ? "bg-accent text-white shadow-sm"
                        : "bg-bg-tertiary/50 text-text-secondary hover:bg-bg-tertiary"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              {/* Page range input (only for range mode) */}
              {options.mode === "range" && (
                <div>
                  <label className="mb-1 block text-xs text-text-tertiary">
                    {t("options.pageRangeLabel", { total: totalPages })}
                  </label>
                  <input
                    type="text"
                    value={options.pageRange}
                    onChange={(e) =>
                      setOptions({ ...options, pageRange: e.target.value })
                    }
                    placeholder={t("options.pageRangePlaceholder")}
                    className="w-full rounded-lg border border-border/50 bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:border-accent"
                  />
                </div>
              )}

              {/* Individual mode description */}
              {options.mode === "individual" && (
                <p className="text-xs text-text-tertiary">
                  {t("options.individualDescription", { count: totalPages })}
                </p>
              )}
            </div>
          </div>

          {/* Page thumbnails grid */}
          {thumbnails.length > 0 && (
            <div className="grid grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {thumbnails.map((thumb, index) => {
                const pageNum = index + 1;
                const isSelected = selectedPages.has(pageNum);
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => togglePage(pageNum)}
                    disabled={options.mode === "individual"}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-accent shadow-md shadow-accent/20"
                        : "border-border/30 opacity-40"
                    } ${options.mode === "range" ? "cursor-pointer hover:border-accent/50" : "cursor-default"}`}
                  >
                    <img
                      src={thumb}
                      alt={`Page ${pageNum}`}
                      className="w-full"
                    />
                    <span
                      className={`absolute bottom-1 right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                        isSelected
                          ? "bg-accent text-white"
                          : "bg-bg-primary/80 text-text-tertiary"
                      }`}
                    >
                      {pageNum}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Action button */}
      <button
        onClick={split}
        disabled={!file || isProcessing}
        className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-accent/90 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing
          ? t("processing")
          : options.mode === "range"
            ? t("extractAndDownload")
            : t("splitAndDownload")}
      </button>

      {error && (
        <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-2.5 text-sm text-error">
          {error}
        </div>
      )}
    </div>
  );
}
