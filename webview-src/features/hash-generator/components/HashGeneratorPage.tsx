import { useTranslation } from "react-i18next";
import { CopyButton } from "@/shared/components/CopyButton";
import { useHashGenerator } from "../hooks/useHashGenerator";
import { useCallback, useState } from "react";
import { openFileDialog } from "@/vscode-api";

export function HashGeneratorPage() {
  const { t } = useTranslation("hash-generator");
  const { input, setInput, results, error, fileName, hashFile } =
    useHashGenerator();
  const [isDragging, setIsDragging] = useState(false);

  const onClickUpload = useCallback(async () => {
    const files = await openFileDialog({ 'All Files': ['*'] }, false);
    if (files[0]) hashFile(files[0]);
  }, [hashFile]);

  const handleCopy = (_algorithm: string) => {
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) hashFile(file);
    },
    [hashFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);


  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("description")}</p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
            <div className="border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5 text-sm font-medium text-text-secondary">
              {t("input")}
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("inputPlaceholder")}
              className="min-h-0 flex-1 resize-none bg-transparent px-4 py-3 font-mono text-sm text-text-primary outline-none placeholder:text-text-tertiary"
            />
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={onClickUpload}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors ${
              isDragging
                ? "border-accent bg-accent/5"
                : "border-border/50 bg-bg-secondary/30 hover:border-accent/50 hover:bg-bg-secondary/50"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="mb-2 h-8 w-8 text-text-tertiary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
            <p className="text-sm text-text-secondary">
              {fileName ? fileName : t("dropFile")}
            </p>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
          <div className="border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5 text-sm font-medium text-text-secondary">
            {t("output")}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {results.length > 0 ? (
              <div className="flex flex-col gap-4">
                {results.map((r) => (
                  <div
                    key={r.algorithm}
                    className="rounded-lg border border-border/50 bg-bg-tertiary/20 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-text-secondary">
                        {r.algorithm}
                      </span>
                      <CopyButton
                        text={r.hash}
                        onCopy={() => handleCopy(r.algorithm)}
                      />
                    </div>
                    <p className="break-all font-mono text-xs text-text-primary">
                      {r.hash}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
                {t("noResults")}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-2.5 text-sm text-error">
          {error}
        </div>
      )}
    </div>
  );
}
