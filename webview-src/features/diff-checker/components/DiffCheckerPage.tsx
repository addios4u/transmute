import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { DiffEditor } from "@monaco-editor/react";
import { useDiffChecker } from "../hooks/useDiffChecker";
import { useTheme } from "@/shared/hooks/useTheme";

export function DiffCheckerPage() {
  const { t } = useTranslation("diff-checker");
  const { t: tc } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const hasEverCompared = useRef(false);
  const {
    original,
    setOriginal,
    modified,
    setModified,
    isComparing,
    compare,
    reset,
    renderSideBySide,
    setRenderSideBySide,
  } = useDiffChecker();

  if (isComparing) hasEverCompared.current = true;

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("description")}</p>
      </div>

      <div className={isComparing ? "hidden" : "contents"}>
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
          {/* Original */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
            <div className="border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5 text-sm font-medium text-text-secondary">
              {t("original")}
            </div>
            <div className="min-h-0 flex-1 p-4">
              <textarea
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
                placeholder={t("originalPlaceholder")}
                className="h-full w-full resize-none rounded-lg border border-border bg-bg-secondary px-3 py-2 font-mono text-sm focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Modified */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
            <div className="border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5 text-sm font-medium text-text-secondary">
              {t("modified")}
            </div>
            <div className="min-h-0 flex-1 p-4">
              <textarea
                value={modified}
                onChange={(e) => setModified(e.target.value)}
                placeholder={t("modifiedPlaceholder")}
                className="h-full w-full resize-none rounded-lg border border-border bg-bg-secondary px-3 py-2 font-mono text-sm focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          onClick={compare}
          disabled={!original && !modified}
          className="w-full rounded-xl bg-accent py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-accent-hover hover:shadow-glow active:scale-[0.99] disabled:opacity-50"
        >
          {t("compare")}
        </button>
      </div>

      <div className={!isComparing ? "hidden" : "flex min-h-0 flex-1 flex-col gap-4"}>
        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-bg-secondary px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-tertiary"
          >
            {tc("action.clear")}
          </button>
          <div className="flex rounded-lg border border-border bg-bg-secondary">
            <button
              onClick={() => setRenderSideBySide(true)}
              className={`rounded-l-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                renderSideBySide
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              {t("sideBySide")}
            </button>
            <button
              onClick={() => setRenderSideBySide(false)}
              className={`rounded-r-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                !renderSideBySide
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              {t("inline")}
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-border/50 shadow-sm">
          {hasEverCompared.current && (
            <DiffEditor
              original={isComparing ? original : ""}
              modified={isComparing ? modified : ""}
              language="plaintext"
              theme={isDark ? "vs-dark" : "light"}
              options={{
                readOnly: true,
                renderSideBySide,
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16 },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
