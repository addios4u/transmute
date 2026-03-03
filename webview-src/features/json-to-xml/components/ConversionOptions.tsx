import { useTranslation } from "react-i18next";
import { FormSelect } from "@/shared/components/FormSelect";
import type { ConversionOptions as ConversionOptionsType } from "../types";

interface ConversionOptionsProps {
  options: ConversionOptionsType;
  onChange: (options: ConversionOptionsType) => void;
}

export function ConversionOptions({ options, onChange }: ConversionOptionsProps) {
  const { t } = useTranslation("json-to-xml");

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/50 bg-bg-secondary/50 px-4 py-3">
      <label className="flex items-center gap-2 text-sm text-text-secondary">
        {t("options.rootElementName")}
        <input
          type="text"
          value={options.rootElementName}
          onChange={(e) => onChange({ ...options, rootElementName: e.target.value })}
          className="w-28 rounded-md border border-border bg-bg-primary px-2.5 py-1 text-sm text-text-primary transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-text-secondary">
        {t("options.indent")}
        <FormSelect
          value={options.indent}
          onChange={(v) => onChange({ ...options, indent: Number(v) })}
          options={[
            { value: "2", label: "2" },
            { value: "4", label: "4" },
          ]}
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-text-secondary">
        <input
          type="checkbox"
          checked={options.xmlDeclaration}
          onChange={(e) => onChange({ ...options, xmlDeclaration: e.target.checked })}
          className="h-4 w-4 rounded border-border accent-accent"
        />
        {t("options.xmlDeclaration")}
      </label>
    </div>
  );
}
