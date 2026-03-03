import { useTranslation } from "react-i18next";
import { MonacoEditorWrapper } from "@/shared/components/MonacoEditorWrapper";
import { CopyButton } from "@/shared/components/CopyButton";
import { ConversionOptions } from "./ConversionOptions";
import { useJsonToXml } from "../hooks/useJsonToXml";

export function JsonToXmlPage() {
  const { t } = useTranslation("json-to-xml");
  const { t: tc } = useTranslation();
  const { input, setInput, options, setOptions, result, convert } = useJsonToXml();

  const handleCopy = () => {
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("description")}</p>
      </div>

      <ConversionOptions options={options} onChange={setOptions} />

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
        <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
          <div className="border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5 text-sm font-medium text-text-secondary">
            JSON
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
            <span className="text-sm font-medium text-text-secondary">XML</span>
            {result?.xml && <CopyButton text={result.xml} onCopy={handleCopy} />}
          </div>
          <div className="min-h-0 flex-1">
            <MonacoEditorWrapper
              value={result?.xml ?? ""}
              language="xml"
              readOnly
            />
          </div>
        </div>
      </div>

      <button
        onClick={convert}
        className="w-full rounded-xl bg-accent py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-accent-hover hover:shadow-glow active:scale-[0.99]"
      >
        {tc("action.convert")}
      </button>

      {result?.error && (
        <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-2.5 text-sm text-error">
          {result.error}
        </div>
      )}
    </div>
  );
}
