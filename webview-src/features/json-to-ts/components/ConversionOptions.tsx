import { useTranslation } from "react-i18next";
import { FormSelect } from "@/shared/components/FormSelect";
import type { ConversionOptions as ConversionOptionsType } from "../types";

interface ConversionOptionsProps {
  options: ConversionOptionsType;
  onChange: (options: ConversionOptionsType) => void;
}

export function ConversionOptions({ options, onChange }: ConversionOptionsProps) {
  const { t } = useTranslation("json-to-ts");

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/50 bg-bg-secondary/50 px-4 py-3">
      <label className="flex items-center gap-2 text-sm text-text-secondary">
        {t("options.rootTypeName")}
        <input
          type="text"
          value={options.rootTypeName}
          onChange={(e) => onChange({ ...options, rootTypeName: e.target.value })}
          className="w-28 rounded-md border border-border bg-bg-primary px-2.5 py-1 text-sm text-text-primary transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </label>

      <div className="flex items-center overflow-hidden rounded-md border border-border">
        <button
          type="button"
          onClick={() => onChange({ ...options, useInterface: false })}
          className={`px-3 py-1 text-sm transition-colors ${
            !options.useInterface
              ? "bg-accent text-white"
              : "bg-bg-primary text-text-secondary hover:bg-bg-tertiary"
          }`}
        >
          {t("options.useType")}
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...options, useInterface: true })}
          className={`px-3 py-1 text-sm transition-colors ${
            options.useInterface
              ? "bg-accent text-white"
              : "bg-bg-primary text-text-secondary hover:bg-bg-tertiary"
          }`}
        >
          {t("options.useInterface")}
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm text-text-secondary">
        {t("options.arrayInference")}
        <FormSelect
          value={options.arrayInference}
          onChange={(v) =>
            onChange({ ...options, arrayInference: v as "first" | "merge" })
          }
          options={[
            { value: "first", label: t("options.firstElement") },
            { value: "merge", label: t("options.mergeAll") },
          ]}
        />
      </label>
    </div>
  );
}
