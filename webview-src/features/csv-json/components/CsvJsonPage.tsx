import { useTranslation } from "react-i18next";
import { MonacoEditorWrapper } from "@/shared/components/MonacoEditorWrapper";
import { CopyButton } from "@/shared/components/CopyButton";
import { useCsvJson } from "../hooks/useCsvJson";
import type { Delimiter } from "../lib/converter";

export function CsvJsonPage() {
  const { t } = useTranslation("csv-json");
  const {
    mode,
    setMode,
    input,
    setInput,
    output,
    delimiter,
    setDelimiter,
    error,
  } = useCsvJson();

  const handleCopy = () => {
  };

  const inputLabel = mode === "csv-to-json" ? "CSV" : "JSON";
  const outputLabel = mode === "csv-to-json" ? "JSON" : "CSV";
  const inputLanguage = mode === "csv-to-json" ? "plaintext" : "json";
  const outputLanguage = mode === "csv-to-json" ? "json" : "plaintext";

  const delimiters: { value: Delimiter; label: string }[] = [
    { value: ",", label: t("delimiterComma") },
    { value: "\t", label: t("delimiterTab") },
    { value: ";", label: t("delimiterSemicolon") },
  ];

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("description")}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={setMode}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
        >
          {mode === "csv-to-json" ? t("csvToJson") : t("jsonToCsv")}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">{t("delimiter")}:</span>
          <div className="flex rounded-lg border border-border bg-bg-secondary">
            {delimiters.map((d) => (
              <button
                key={d.value}
                onClick={() => setDelimiter(d.value)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors first:rounded-l-lg last:rounded-r-lg ${
                  delimiter === d.value
                    ? "bg-accent text-white"
                    : "text-text-secondary hover:bg-bg-tertiary"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
          <div className="border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5 text-sm font-medium text-text-secondary">
            {inputLabel}
          </div>
          <div className="min-h-0 flex-1">
            <MonacoEditorWrapper
              value={input}
              onChange={(v) => setInput(v ?? "")}
              language={inputLanguage as "json" | "plaintext"}
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5">
            <span className="text-sm font-medium text-text-secondary">
              {outputLabel}
            </span>
            {output && <CopyButton text={output} onCopy={handleCopy} />}
          </div>
          <div className="min-h-0 flex-1">
            <MonacoEditorWrapper
              value={output}
              language={outputLanguage as "json" | "plaintext"}
              readOnly
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-2.5 text-sm text-error">
          {t(`error.${error}`)}
        </div>
      )}
    </div>
  );
}
