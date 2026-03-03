import { useTranslation } from "react-i18next";
import { FORMAT_LABELS } from "@/features/image-converter/types";
import type { ResizeOptions as ResizeOptionsType, OutputFormat } from "../types";

interface ResizeOptionsProps {
  options: ResizeOptionsType;
  onChange: (options: ResizeOptionsType) => void;
}

const FORMATS: OutputFormat[] = ["image/png", "image/jpeg", "image/webp"];

export function ResizeOptions({ options, onChange }: ResizeOptionsProps) {
  const { t } = useTranslation("image-resizer");

  const isPng = options.outputFormat === "image/png";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-bg-secondary/50 px-4 py-3">
      {/* Row 1: Resize mode + value */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm text-text-secondary">
          {t("options.resize")}
        </label>
        <div className="flex items-center overflow-hidden rounded-md border border-border">
          <button
            type="button"
            onClick={() => onChange({ ...options, mode: "ratio" })}
            className={`px-3 py-1 text-sm transition-colors ${
              options.mode === "ratio"
                ? "bg-accent text-white"
                : "bg-bg-primary text-text-secondary hover:bg-bg-tertiary"
            }`}
          >
            {t("options.ratio")}
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...options, mode: "maxDimension" })}
            className={`px-3 py-1 text-sm transition-colors ${
              options.mode === "maxDimension"
                ? "bg-accent text-white"
                : "bg-bg-primary text-text-secondary hover:bg-bg-tertiary"
            }`}
          >
            {t("options.maxDimension")}
          </button>
        </div>

        {options.mode === "ratio" ? (
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={options.ratio}
              onChange={(e) =>
                onChange({ ...options, ratio: parseFloat(e.target.value) })
              }
              className="h-1.5 w-28 cursor-pointer accent-accent"
            />
            <span className="w-10 text-right tabular-nums">
              {Math.round(options.ratio * 100)}%
            </span>
          </label>
        ) : (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <label className="flex items-center gap-1">
              {t("options.width")}
              <input
                type="number"
                min="1"
                max="10000"
                value={options.maxWidth}
                onChange={(e) =>
                  onChange({ ...options, maxWidth: parseInt(e.target.value) || 1 })
                }
                className="w-20 rounded-md border border-border bg-bg-primary px-2 py-1 text-sm text-text-primary tabular-nums transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </label>
            <span>×</span>
            <label className="flex items-center gap-1">
              {t("options.height")}
              <input
                type="number"
                min="1"
                max="10000"
                value={options.maxHeight}
                onChange={(e) =>
                  onChange({ ...options, maxHeight: parseInt(e.target.value) || 1 })
                }
                className="w-20 rounded-md border border-border bg-bg-primary px-2 py-1 text-sm text-text-primary tabular-nums transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </label>
            <span className="text-text-tertiary">px</span>
          </div>
        )}
      </div>

      {/* Row 2: Format + quality */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm text-text-secondary">
          {t("options.format")}
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
    </div>
  );
}
