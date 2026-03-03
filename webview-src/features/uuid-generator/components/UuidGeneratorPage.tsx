import { useTranslation } from "react-i18next";
import { CopyButton } from "@/shared/components/CopyButton";
import { useUuidGenerator } from "../hooks/useUuidGenerator";
import { FormSelect } from "@/shared/components/FormSelect";
import { COUNT_OPTIONS } from "../lib/uuid";
import { useState } from "react";
import { copyToClipboard } from "@/vscode-api";

export function UuidGeneratorPage() {
  const { t } = useTranslation("uuid-generator");
  const { options, setOptions, uuids, generate } = useUuidGenerator();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyAll = () => {
  };

  const handleCopyRow = (uuid: string, index: number) => {
    copyToClipboard(uuid);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("description")}</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-text-secondary">
            {t("options.count")}
          </label>
          <FormSelect
            value={options.count}
            onChange={(v) =>
              setOptions((prev) => ({ ...prev, count: Number(v) }))
            }
            options={COUNT_OPTIONS.map((n) => ({
              value: String(n),
              label: String(n),
            }))}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-text-secondary">
            {t("options.case")}
          </label>
          <div className="flex overflow-hidden rounded-lg border border-border">
            <button
              onClick={() =>
                setOptions((prev) => ({ ...prev, uppercase: false }))
              }
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                !options.uppercase
                  ? "bg-accent text-white"
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              {t("options.lowercase")}
            </button>
            <button
              onClick={() =>
                setOptions((prev) => ({ ...prev, uppercase: true }))
              }
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                options.uppercase
                  ? "bg-accent text-white"
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              {t("options.uppercase")}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-text-secondary">
            {t("options.hyphens")}
          </label>
          <div className="flex overflow-hidden rounded-lg border border-border">
            <button
              onClick={() =>
                setOptions((prev) => ({ ...prev, hyphens: true }))
              }
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                options.hyphens
                  ? "bg-accent text-white"
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              {t("options.withHyphens")}
            </button>
            <button
              onClick={() =>
                setOptions((prev) => ({ ...prev, hyphens: false }))
              }
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                !options.hyphens
                  ? "bg-accent text-white"
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              {t("options.withoutHyphens")}
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={generate}
        className="w-full rounded-xl bg-accent py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-accent-hover hover:shadow-glow active:scale-[0.99]"
      >
        {t("generate")}
      </button>

      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5">
          <span className="text-sm font-medium text-text-secondary">
            {t("output")}
            {uuids.length > 0 && (
              <span className="ml-2 text-text-tertiary">({uuids.length})</span>
            )}
          </span>
          {uuids.length > 0 && (
            <CopyButton text={uuids.join("\n")} onCopy={handleCopyAll} />
          )}
        </div>
        <div className="h-full overflow-y-auto p-2">
          {uuids.length > 0 ? (
            <div className="flex flex-col gap-1">
              {uuids.map((uuid, i) => (
                <button
                  key={i}
                  onClick={() => handleCopyRow(uuid, i)}
                  className={`rounded-lg px-3 py-2 text-left font-mono text-sm transition-colors ${
                    copiedIndex === i
                      ? "bg-success/10 text-success"
                      : "text-text-primary hover:bg-bg-tertiary/50"
                  }`}
                >
                  {copiedIndex === i ? `${uuid}  ✓` : uuid}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center py-12 text-sm text-text-tertiary">
              {t("noResults")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
