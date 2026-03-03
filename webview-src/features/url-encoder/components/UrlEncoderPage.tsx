import { useTranslation } from "react-i18next";
import { CopyButton } from "@/shared/components/CopyButton";
import { useUrlEncoder } from "../hooks/useUrlEncoder";
import type { UrlMode } from "../lib/encoder";

export function UrlEncoderPage() {
  const { t } = useTranslation("url-encoder");
  const { input, setInput, result, mode, setMode } = useUrlEncoder();

  const handleCopy = () => {
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("description")}</p>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-text-secondary">
          {t("options.mode")}
        </label>
        <div className="flex overflow-hidden rounded-lg border border-border">
          {(["encode", "decode"] as UrlMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-accent text-white"
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              {t(`options.${m}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
        <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
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

        <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5">
            <span className="text-sm font-medium text-text-secondary">
              {t("output")}
            </span>
            {result?.output && (
              <CopyButton text={result.output} onCopy={handleCopy} />
            )}
          </div>
          <textarea
            value={result?.output ?? ""}
            readOnly
            className="min-h-0 flex-1 resize-none bg-transparent px-4 py-3 font-mono text-sm text-text-primary outline-none"
          />
        </div>
      </div>

      {result?.error && (
        <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-2.5 text-sm text-error">
          {result.error}
        </div>
      )}
    </div>
  );
}
