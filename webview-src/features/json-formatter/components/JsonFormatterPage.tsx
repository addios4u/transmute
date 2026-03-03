import { useTranslation } from "react-i18next";
import { MonacoEditorWrapper } from "@/shared/components/MonacoEditorWrapper";
import { CopyButton } from "@/shared/components/CopyButton";
import { useJsonFormatter } from "../hooks/useJsonFormatter";
import { FormSelect } from "@/shared/components/FormSelect";
import type { IndentType } from "../lib/formatter";

export function JsonFormatterPage() {
  const { t } = useTranslation("json-formatter");
  const { input, setInput, result, indent, setIndent, mode, setMode } =
    useJsonFormatter();

  const handleCopy = () => {
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("description")}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-text-secondary">
            {t("options.mode")}
          </label>
          <div className="flex overflow-hidden rounded-lg border border-border">
            <button
              onClick={() => setMode("format")}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === "format"
                  ? "bg-accent text-white"
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              {t("options.format")}
            </button>
            <button
              onClick={() => setMode("minify")}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === "minify"
                  ? "bg-accent text-white"
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              {t("options.minify")}
            </button>
          </div>
        </div>

        {mode === "format" && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-text-secondary">
              {t("options.indent")}
            </label>
            <FormSelect
              value={indent}
              onChange={(v) => setIndent(v as IndentType)}
              options={[
                { value: "2", label: t("options.indent2") },
                { value: "4", label: t("options.indent4") },
                { value: "tab", label: t("options.indentTab") },
              ]}
            />
          </div>
        )}
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
              language="json"
            />
          </div>
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
          <div className="min-h-0 flex-1">
            <MonacoEditorWrapper
              value={result?.output ?? ""}
              language="json"
              readOnly
            />
          </div>
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
