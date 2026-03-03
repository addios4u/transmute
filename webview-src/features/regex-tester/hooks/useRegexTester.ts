import { useState, useMemo } from "react";

export interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
}

export interface RegexResult {
  matches: RegexMatch[];
  matchCount: number;
  error: string | null;
}

export function useRegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const [testString, setTestString] = useState("");

  const flagString = useMemo(() => {
    return Object.entries(flags)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join("");
  }, [flags]);

  const result = useMemo<RegexResult | null>(() => {
    if (!pattern || !testString) return null;

    try {
      const regex = new RegExp(pattern, flagString);
      const matches: RegexMatch[] = [];

      if (flags.g) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (match[0].length === 0) {
            regex.lastIndex++;
          }
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      return {
        matches,
        matchCount: matches.length,
        error: null,
      };
    } catch (e) {
      return {
        matches: [],
        matchCount: 0,
        error: e instanceof Error ? e.message : "Invalid regular expression",
      };
    }
  }, [pattern, testString, flagString, flags.g]);

  const toggleFlag = (flag: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  return { pattern, setPattern, flags, toggleFlag, testString, setTestString, result };
}
