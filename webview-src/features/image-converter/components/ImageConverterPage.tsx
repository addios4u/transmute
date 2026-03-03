import { useState, type DragEvent } from "react";
import { useTranslation } from "react-i18next";
import { useImageConverter } from "../hooks/useImageConverter";
import { formatFileSize } from "../lib/converter";
import { ConversionOptions } from "./ConversionOptions";
import { openFileDialog } from "@/vscode-api";

export function ImageConverterPage() {
  const { t } = useTranslation("image-converter");
  const { t: tc } = useTranslation();

  const {
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
  } = useImageConverter();
  const [isDragging, setIsDragging] = useState(false);

  const onClickUpload = async () => {
    const files = await openFileDialog({ 'Images': ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'tiff'] }, false);
    if (files[0]) handleFile(files[0]);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };


  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("description")}</p>
      </div>

      <ConversionOptions options={options} onChange={setOptions} />

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
        {/* Left: Input */}
        <div className="flex flex-col gap-3 overflow-hidden">
          <span className="text-sm font-medium text-text-secondary">
            {t("input")}
          </span>

          {!sourceFile ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={onClickUpload}
              className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-all duration-200 ${
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
          ) : (
            <div className="flex flex-1 flex-col gap-3 overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 p-4 shadow-sm">
              <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
                <img
                  src={sourcePreview ?? ""}
                  alt={sourceFile.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="flex-1 truncate text-sm text-text-secondary">
                  {sourceFile.name} ({formatFileSize(sourceFile.size)})
                </span>
                <button
                  onClick={() => {
                    clear();
                    onClickUpload();
                  }}
                  className="shrink-0 rounded-md border border-border px-3 py-1.5 text-sm text-text-secondary transition-all duration-200 hover:bg-bg-tertiary active:scale-95"
                >
                  {t("changeImage")}
                </button>
                <button
                  onClick={clear}
                  className="shrink-0 rounded-md border border-border px-3 py-1.5 text-sm text-text-secondary transition-all duration-200 hover:bg-bg-tertiary active:scale-95"
                >
                  {tc("action.clear")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Output */}
        <div className="flex flex-col gap-3 overflow-hidden">
          <span className="text-sm font-medium text-text-secondary">
            {t("output")}
          </span>

          {!result ? (
            <div className="flex flex-1 items-center justify-center rounded-xl border border-border/50 bg-bg-secondary/50 p-10 shadow-sm">
              <p className="text-sm text-text-tertiary">{t("noResult")}</p>
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-3 overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 p-4 shadow-sm">
              <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
                <img
                  src={result.dataUrl}
                  alt={result.fileName}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="space-y-1 text-sm text-text-secondary">
                <p>
                  {t("sizeComparison", {
                    original: formatFileSize(result.originalSize),
                    converted: formatFileSize(result.convertedSize),
                    ratio:
                      result.convertedSize <= result.originalSize
                        ? `-${Math.round((1 - result.convertedSize / result.originalSize) * 100)}%`
                        : `+${Math.round((result.convertedSize / result.originalSize - 1) * 100)}%`,
                  })}
                </p>
                <p>{t("resolution", { width: result.width, height: result.height })}</p>
              </div>
              <button
                onClick={download}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-accent/90 hover:shadow-md active:scale-[0.98]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {tc("action.download")} ({result.fileName})
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={convert}
        disabled={!sourceFile || isConverting}
        className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-accent/90 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isConverting ? t("converting") : tc("action.convert")}
      </button>

      {error && (
        <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-2.5 text-sm text-error">
          {error}
        </div>
      )}
    </div>
  );
}
