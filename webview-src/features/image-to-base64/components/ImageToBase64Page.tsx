import { useState, type DragEvent } from "react";
import { useTranslation } from "react-i18next";
import { MonacoEditorWrapper } from "@/shared/components/MonacoEditorWrapper";
import { CopyButton } from "@/shared/components/CopyButton";
import { useImageToBase64 } from "../hooks/useImageToBase64";
import { formatFileSize } from "../lib/encoder";
import { openFileDialog } from "@/vscode-api";

export function ImageToBase64Page() {
  const { t } = useTranslation("image-to-base64");
  const { t: tc } = useTranslation();

  const { result, error, handleFile, clear } = useImageToBase64();
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


  const handleCopy = () => {
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("description")}</p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={onClickUpload}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-all duration-200 ${
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

      {error && (
        <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-2.5 text-sm text-error">
          {error}
        </div>
      )}

      {result && (
        <>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">
              {t("fileInfo", { name: result.fileName, size: formatFileSize(result.fileSize) })}
            </span>
            <CopyButton text={result.base64} onCopy={handleCopy} />
            <button
              onClick={clear}
              className="rounded-md border border-border px-3 py-1.5 text-sm text-text-secondary transition-all duration-200 hover:bg-bg-tertiary active:scale-95"
            >
              {tc("action.clear")}
            </button>
          </div>
          <div className="flex items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 p-4 shadow-sm">
            <img
              src={result.dataUrl}
              alt={result.fileName}
              className="max-h-48 max-w-full object-contain"
            />
          </div>
          <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
            <MonacoEditorWrapper value={result.base64} language="plaintext" readOnly />
          </div>
        </>
      )}
    </div>
  );
}
