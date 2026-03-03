import { useTranslation } from "react-i18next";
import { MonacoEditorWrapper } from "@/shared/components/MonacoEditorWrapper";
import { CopyButton } from "@/shared/components/CopyButton";
import { useXmlToJson } from "../hooks/useXmlToJson";

export function XmlToJsonPage() {
  const { t } = useTranslation("xml-to-json");
  const { t: tc } = useTranslation();
  const { input, setInput, result, convert } = useXmlToJson();

  const handleCopy = () => {
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("description")}</p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
        <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
          <div className="border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5 text-sm font-medium text-text-secondary">
            XML
          </div>
          <div className="min-h-0 flex-1">
            <MonacoEditorWrapper
              value={input}
              onChange={(v) => setInput(v ?? "")}
              language="xml"
            />
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5">
            <span className="text-sm font-medium text-text-secondary">JSON</span>
            {result?.json && <CopyButton text={result.json} onCopy={handleCopy} />}
          </div>
          <div className="min-h-0 flex-1">
            <MonacoEditorWrapper
              value={result?.json ?? ""}
              language="json"
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
