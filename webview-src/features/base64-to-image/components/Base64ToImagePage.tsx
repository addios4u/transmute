import { useTranslation } from "react-i18next";
import { MonacoEditorWrapper } from "@/shared/components/MonacoEditorWrapper";
import { useBase64ToImage } from "../hooks/useBase64ToImage";

export function Base64ToImagePage() {
  const { t } = useTranslation("base64-to-image");
  const { t: tc } = useTranslation();
  const { input, setInput, imageUrl, error, convert, download } = useBase64ToImage();

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("description")}</p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
        <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
          <div className="border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5 text-sm font-medium text-text-secondary">
            {t("input")}
          </div>
          <div className="min-h-0 flex-1">
            <MonacoEditorWrapper
              value={input}
              onChange={(v) => setInput(v ?? "")}
              language="plaintext"
            />
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5">
            <span className="text-sm font-medium text-text-secondary">{t("preview")}</span>
            {imageUrl && (
              <button
                onClick={download}
                className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-accent-hover hover:shadow-md active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {tc("action.download")}
              </button>
            )}
          </div>
          <div className="flex flex-1 items-center justify-center overflow-auto p-4">
            {imageUrl ? (
              <img src={imageUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
            ) : (
              <p className="text-sm text-text-tertiary">{t("noPreview")}</p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={convert}
        className="w-full rounded-xl bg-accent py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-accent-hover hover:shadow-glow active:scale-[0.99]"
      >
        {tc("action.convert")}
      </button>

      {error && (
        <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-2.5 text-sm text-error">
          {error}
        </div>
      )}
    </div>
  );
}
