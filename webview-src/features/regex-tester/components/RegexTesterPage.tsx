import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRegexTester } from "../hooks/useRegexTester";

export function RegexTesterPage() {
  const { t } = useTranslation("regex-tester");
  const {
    pattern,
    setPattern,
    flags,
    toggleFlag,
    testString,
    setTestString,
    result,
  } = useRegexTester();

  const highlightedHtml = useMemo(() => {
    if (!result || result.error || result.matches.length === 0 || !testString) {
      return escapeHtml(testString);
    }

    try {
      const flagString = Object.entries(flags)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join("");
      const regex = new RegExp(pattern, flagString.includes("g") ? flagString : flagString + "g");
      let lastIndex = 0;
      const parts: string[] = [];
      let match;

      // Reset lastIndex
      regex.lastIndex = 0;

      while ((match = regex.exec(testString)) !== null) {
        if (match.index > lastIndex) {
          parts.push(escapeHtml(testString.slice(lastIndex, match.index)));
        }
        parts.push(
          `<mark class="rounded bg-accent/20 text-accent px-0.5">${escapeHtml(match[0])}</mark>`,
        );
        lastIndex = match.index + match[0].length;
        if (match[0].length === 0) {
          regex.lastIndex++;
          if (regex.lastIndex > testString.length) break;
        }
      }

      if (lastIndex < testString.length) {
        parts.push(escapeHtml(testString.slice(lastIndex)));
      }

      return parts.join("");
    } catch {
      return escapeHtml(testString);
    }
  }, [result, testString, pattern, flags]);

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("description")}</p>
      </div>

      {/* Pattern input */}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center rounded-lg border border-border bg-bg-secondary">
          <span className="px-3 text-text-tertiary">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder={t("patternPlaceholder")}
            className="flex-1 bg-transparent py-2 font-mono text-sm focus:outline-none"
          />
          <span className="px-3 text-text-tertiary">/</span>
        </div>

        {/* Flags */}
        <div className="flex gap-1">
          {(["g", "i", "m", "s"] as const).map((flag) => (
            <button
              key={flag}
              onClick={() => toggleFlag(flag)}
              className={`rounded-md px-3 py-2 font-mono text-sm font-medium transition-colors ${
                flags[flag]
                  ? "bg-accent text-white"
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              {flag}
            </button>
          ))}
        </div>
      </div>

      {result?.error && (
        <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-2.5 text-sm text-error">
          {result.error}
        </div>
      )}

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
        {/* Test string input */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
          <div className="border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5 text-sm font-medium text-text-secondary">
            {t("testString")}
          </div>
          <div className="min-h-0 flex-1 p-4">
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder={t("testStringPlaceholder")}
              className="h-full w-full resize-none rounded-lg border border-border bg-bg-secondary px-3 py-2 font-mono text-sm focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-3 overflow-y-auto">
          {/* Match count */}
          {result && !result.error && (
            <div className="rounded-xl border border-border/50 bg-bg-secondary/50 px-4 py-2.5 shadow-sm">
              <span className="text-sm text-text-secondary">
                {t("matchCount")}:{" "}
              </span>
              <span className="font-semibold text-accent">
                {result.matchCount}
              </span>
            </div>
          )}

          {/* Highlighted result */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
            <div className="border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5 text-sm font-medium text-text-secondary">
              {t("matchResult")}
            </div>
            <div
              className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-all p-4 font-mono text-sm"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          </div>

          {/* Match groups */}
          {result &&
            !result.error &&
            result.matches.some((m) => m.groups.length > 0) && (
              <div className="flex flex-col overflow-hidden rounded-xl border border-border/50 bg-bg-secondary/50 shadow-sm">
                <div className="border-b border-border/50 bg-bg-tertiary/30 px-4 py-2.5 text-sm font-medium text-text-secondary">
                  {t("groups")}
                </div>
                <div className="overflow-auto p-4">
                  {result.matches.map((match, i) => (
                    <div key={i} className="mb-2 last:mb-0">
                      <div className="text-xs font-medium text-text-tertiary">
                        {t("matchIndex", { index: i + 1 })}
                      </div>
                      {match.groups.map((group, j) => (
                        <div
                          key={j}
                          className="ml-2 font-mono text-sm text-text-primary"
                        >
                          <span className="text-text-tertiary">
                            {t("group")} {j + 1}:{" "}
                          </span>
                          <span className="text-accent">{group}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
