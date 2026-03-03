import { useState, type DragEvent } from "react";
import { useTranslation } from "react-i18next";
import { formatFileSize } from "@/features/image-converter/lib/converter";
import { useImageResizer } from "../hooks/useImageResizer";
import { ResizeOptions } from "./ResizeOptions";
import { openFileDialog } from "@/vscode-api";

export function ImageResizerPage() {
  const { t } = useTranslation("image-resizer");
  const { t: tc } = useTranslation();

  const {
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
  } = useImageResizer();
  const [isDragging, setIsDragging] = useState(false);

  const onClickUpload = async () => {
    const files = await openFileDialog({ 'Images': ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'], 'ZIP': ['zip'] }, true);
    if (files.length > 0) addFiles(files);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) addFiles(droppedFiles);
  };


  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("description")}</p>
      </div>

      <ResizeOptions options={options} onChange={setOptions} />

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

      {/* File grid */}
      {files.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              {t("fileCount", { count: files.length })}
            </span>
            <button
              onClick={clear}
              disabled={isProcessing}
              className="rounded-md border border-border px-3 py-1.5 text-sm text-text-secondary transition-all duration-200 hover:bg-bg-tertiary active:scale-95 disabled:opacity-50"
            >
              {tc("action.clear")}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {files.map((item) => (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-lg border border-border/50 bg-bg-secondary/50 shadow-sm"
              >
                <div className="flex aspect-square items-center justify-center overflow-hidden bg-bg-tertiary/30 p-2">
                  <img
                    src={item.preview}
                    alt={item.file.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="space-y-0.5 p-2">
                  <p className="truncate text-xs font-medium text-text-primary">
                    {item.file.name}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {item.originalWidth}×{item.originalHeight} · {formatFileSize(item.file.size)}
                  </p>
                  {item.status === "done" && item.result && (
                    <p className="text-xs text-success">
                      → {item.result.width}×{item.result.height}
                    </p>
                  )}
                  {item.status === "processing" && (
                    <p className="text-xs text-accent">{t("processing")}</p>
                  )}
                  {item.status === "error" && (
                    <p className="text-xs text-error">{t("errorItem")}</p>
                  )}
                </div>
                {!isProcessing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(item.id);
                    }}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-bg-primary/80 text-text-tertiary transition-colors hover:bg-error/20 hover:text-error"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Progress bar */}
      {isProcessing && (
        <div className="space-y-1">
          <div className="h-2 overflow-hidden rounded-full bg-bg-tertiary">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{
                width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="text-center text-xs text-text-secondary">
            {t("progressText", {
              current: progress.current,
              total: progress.total,
            })}
          </p>
        </div>
      )}

      {/* Action button */}
      <button
        onClick={processAll}
        disabled={files.length === 0 || isProcessing}
        className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-accent/90 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing
          ? t("processing")
          : t("resizeAndDownload", { count: files.length })}
      </button>

      {error && (
        <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-2.5 text-sm text-error">
          {error}
        </div>
      )}
    </div>
  );
}
