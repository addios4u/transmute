import { useState, type DragEvent } from "react";
import { useTranslation } from "react-i18next";
import { usePdfMerge } from "../hooks/usePdfMerge";
import { openFileDialog } from "@/vscode-api";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function PdfMergePage() {
  const { t } = useTranslation("pdf-merge");
  const { t: tc } = useTranslation();
  const {
    files,
    isProcessing,
    error,
    addFiles,
    removeFile,
    moveFile,
    merge,
    clear,
  } = usePdfMerge();
  const [isDragging, setIsDragging] = useState(false);

  const onClickUpload = async () => {
    const files = await openFileDialog({ 'PDF': ['pdf'] }, true);
    if (files.length > 0) addFiles(files);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) addFiles(droppedFiles);
  };


  const totalPages = files.reduce((sum, f) => sum + f.pageCount, 0);

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

      {/* File list */}
      {files.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              {t("fileCount", { count: files.length })} · {t("totalPages", { count: totalPages })}
            </span>
            <button
              onClick={clear}
              disabled={isProcessing}
              className="rounded-md border border-border px-3 py-1.5 text-sm text-text-secondary transition-all duration-200 hover:bg-bg-tertiary active:scale-95 disabled:opacity-50"
            >
              {tc("action.clear")}
            </button>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto">
            {files.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-lg border border-border/50 bg-bg-secondary/50 px-4 py-3 shadow-sm"
              >
                {/* Order number */}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                  {index + 1}
                </span>

                {/* Thumbnail */}
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.fileName}
                    className="h-12 w-9 shrink-0 rounded border border-border/30 object-cover shadow-sm"
                  />
                ) : (
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
                )}

                {/* File info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {item.fileName}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {t("pages", { count: item.pageCount })} · {formatFileSize(item.fileSize)}
                  </p>
                </div>

                {/* Move buttons */}
                {!isProcessing && (
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => moveFile(item.id, "up")}
                      disabled={index === 0}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary disabled:opacity-30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveFile(item.id, "down")}
                      disabled={index === files.length - 1}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary disabled:opacity-30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeFile(item.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-error/10 hover:text-error"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Action button */}
      <button
        onClick={merge}
        disabled={files.length < 2 || isProcessing}
        className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-accent/90 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing
          ? t("processing")
          : t("mergeAndDownload", { count: files.length })}
      </button>

      {error && (
        <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-2.5 text-sm text-error">
          {error}
        </div>
      )}
    </div>
  );
}
