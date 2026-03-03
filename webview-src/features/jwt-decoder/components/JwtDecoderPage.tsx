import { useTranslation } from "react-i18next";
import { CopyButton } from "@/shared/components/CopyButton";
import { useJwtDecoder } from "../hooks/useJwtDecoder";

export function JwtDecoderPage() {
  const { t } = useTranslation("jwt-decoder");
  const { input, setInput, result } = useJwtDecoder();

  const handleCopy = (section: string) => {
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("description")}</p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
          <div className="border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5 text-sm font-medium text-text-secondary">
            {t("inputLabel")}
          </div>
          <div className="min-h-0 flex-1 p-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("inputPlaceholder")}
              className="h-full w-full resize-none rounded-lg border border-border bg-bg-secondary px-3 py-2 font-mono text-sm focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col gap-3 overflow-y-auto">
          {result?.error && (
            <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-2.5 text-sm text-error">
              {t(`error.${result.error}`)}
            </div>
          )}

          {result && !result.error && (
            <>
              {/* Header */}
              <div className="rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
                <div className="flex items-center justify-between border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5">
                  <span className="text-sm font-medium text-text-secondary">
                    {t("header")}
                  </span>
                  <CopyButton
                    text={result.header}
                    onCopy={() => handleCopy("header")}
                  />
                </div>
                <pre className="overflow-auto p-4 font-mono text-sm text-text-primary">
                  {result.header}
                </pre>
              </div>

              {/* Payload */}
              <div className="rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
                <div className="flex items-center justify-between border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5">
                  <span className="text-sm font-medium text-text-secondary">
                    {t("payload")}
                  </span>
                  <CopyButton
                    text={result.payload}
                    onCopy={() => handleCopy("payload")}
                  />
                </div>
                <pre className="overflow-auto p-4 font-mono text-sm text-text-primary">
                  {result.payload}
                </pre>
                {result.expiresAt && (
                  <div className="border-t border-border/50 px-4 py-2.5 text-sm">
                    <span className="text-text-secondary">
                      {t("expiresAt")}:{" "}
                    </span>
                    <span
                      className={
                        result.isExpired ? "text-error" : "text-success"
                      }
                    >
                      {new Date(result.expiresAt).toLocaleString()}
                      {result.isExpired
                        ? ` (${t("expired")})`
                        : ` (${t("valid")})`}
                    </span>
                  </div>
                )}
              </div>

              {/* Signature */}
              <div className="rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
                <div className="flex items-center justify-between border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5">
                  <span className="text-sm font-medium text-text-secondary">
                    {t("signature")}
                  </span>
                  <CopyButton
                    text={result.signature}
                    onCopy={() => handleCopy("signature")}
                  />
                </div>
                <pre className="overflow-auto break-all p-4 font-mono text-sm text-text-primary">
                  {result.signature}
                </pre>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
