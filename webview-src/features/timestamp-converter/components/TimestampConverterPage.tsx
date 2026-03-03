import { useTranslation } from "react-i18next";
import { CopyButton } from "@/shared/components/CopyButton";
import { useTimestampConverter } from "../hooks/useTimestampConverter";
import type { ConvertMode } from "../hooks/useTimestampConverter";

export function TimestampConverterPage() {
  const { t } = useTranslation("timestamp-converter");
  const {
    mode,
    setMode,
    timestampInput,
    setTimestampInput,
    dateInput,
    setDateInput,
    result,
    error,
    currentTime,
  } = useTimestampConverter();

  const handleCopy = () => {
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("description")}</p>
      </div>

      {/* Current time display */}
      {currentTime && (
        <div className="rounded-xl border border-border/50 bg-bg-secondary/50 p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-text-secondary">
            {t("currentTime")}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-border/50 bg-bg-tertiary/20 p-3">
              <p className="mb-1 text-xs text-text-tertiary">Unix (s)</p>
              <div className="flex items-center justify-between">
                <p className="font-mono text-sm text-text-primary">
                  {currentTime.unix}
                </p>
                <CopyButton
                  text={String(currentTime.unix)}
                  onCopy={handleCopy}
                />
              </div>
            </div>
            <div className="rounded-lg border border-border/50 bg-bg-tertiary/20 p-3">
              <p className="mb-1 text-xs text-text-tertiary">ISO 8601</p>
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-text-primary">
                  {currentTime.iso}
                </p>
                <CopyButton text={currentTime.iso} onCopy={handleCopy} />
              </div>
            </div>
            <div className="rounded-lg border border-border/50 bg-bg-tertiary/20 p-3">
              <p className="mb-1 text-xs text-text-tertiary">{t("localTime")}</p>
              <p className="font-mono text-xs text-text-primary">
                {currentTime.local}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode selector */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-text-secondary">
          {t("options.mode")}
        </label>
        <div className="flex overflow-hidden rounded-lg border border-border">
          {(["toDate", "toTimestamp"] as ConvertMode[]).map((m) => (
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
        {/* Input */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
          <div className="border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5 text-sm font-medium text-text-secondary">
            {t("input")}
          </div>
          <div className="flex-1 p-4">
            {mode === "toDate" ? (
              <input
                type="text"
                value={timestampInput}
                onChange={(e) => setTimestampInput(e.target.value)}
                placeholder={t("timestampPlaceholder")}
                className="w-full rounded-lg border border-border bg-bg-secondary px-3 py-2 font-mono text-sm"
              />
            ) : (
              <input
                type="datetime-local"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                step="1"
                className="w-full rounded-lg border border-border bg-bg-secondary px-3 py-2 text-sm"
              />
            )}
            {mode === "toDate" && (
              <p className="mt-2 text-xs text-text-tertiary">
                {t("autoDetect")}
              </p>
            )}
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
          <div className="border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5 text-sm font-medium text-text-secondary">
            {t("output")}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {result ? (
              <div className="flex flex-col gap-3">
                <ResultRow
                  label="Unix (s)"
                  value={String(result.unix)}
                  onCopy={handleCopy}
                />
                <ResultRow
                  label="Unix (ms)"
                  value={String(result.unixMs)}
                  onCopy={handleCopy}
                />
                <ResultRow
                  label="ISO 8601"
                  value={result.iso}
                  onCopy={handleCopy}
                />
                <ResultRow
                  label="UTC"
                  value={result.utc}
                  onCopy={handleCopy}
                />
                <ResultRow
                  label={t("localTime")}
                  value={result.local}
                  onCopy={handleCopy}
                />
                <ResultRow
                  label={t("relative")}
                  value={result.relative}
                  onCopy={handleCopy}
                />
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

function ResultRow({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-bg-tertiary/20 p-3">
      <p className="mb-1 text-xs text-text-tertiary">{label}</p>
      <div className="flex items-center justify-between gap-2">
        <p className="break-all font-mono text-sm text-text-primary">{value}</p>
        <CopyButton text={value} onCopy={onCopy} />
      </div>
    </div>
  );
}
