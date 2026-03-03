import { useTranslation } from "react-i18next";
import type { ConversionOptions as ConversionOptionsType, OutputFormat } from "../types";
import { FORMAT_LABELS } from "../types";

interface ConversionOptionsProps {
  options: ConversionOptionsType;
  onChange: (options: ConversionOptionsType) => void;
}

const FORMATS: OutputFormat[] = ["image/png", "image/jpeg", "image/webp"];

export function ConversionOptions({ options, onChange }: ConversionOptionsProps) {
  const { t } = useTranslation("image-converter");

  const isPng = options.outputFormat === "image/png";

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/50 bg-bg-secondary/50 px-4 py-3">
      <label className="text-sm text-text-secondary">
        {t("options.outputFormat")}
      </label>
      <div className="flex items-center overflow-hidden rounded-md border border-border">
        {FORMATS.map((format) => (
          <button
            key={format}
            type="button"
            onClick={() => onChange({ ...options, outputFormat: format })}
            className={`px-3 py-1 text-sm transition-colors ${
              options.outputFormat === format
                ? "bg-accent text-white"
                : "bg-bg-primary text-text-secondary hover:bg-bg-tertiary"
            }`}
          >
            {FORMAT_LABELS[format]}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm text-text-secondary">
        {t("options.quality")}
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.01"
          value={options.quality}
          disabled={isPng}
          onChange={(e) =>
            onChange({ ...options, quality: parseFloat(e.target.value) })
          }
          className="h-1.5 w-24 cursor-pointer accent-accent disabled:cursor-not-allowed disabled:opacity-40"
        />
        <span className="w-10 text-right tabular-nums">
          {isPng ? "—" : `${Math.round(options.quality * 100)}%`}
        </span>
      </label>
    </div>
  );
}
