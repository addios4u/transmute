import { useState, useEffect, useCallback, createContext, useContext } from "react";

export type ResolvedTheme = "light" | "dark";

export interface ThemeContextValue {
  theme: "system";
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: string) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

function detectVscodeTheme(): ResolvedTheme {
  const themeKind = document.body.dataset.vscodeThemeKind;
  if (themeKind === "vscode-light" || themeKind === "vscode-high-contrast-light") {
    return "light";
  }
  return "dark";
}

export function useVscodeTheme(): ThemeContextValue {
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(detectVscodeTheme);

  useEffect(() => {
    // Apply dark class based on detected theme
    const applyTheme = (theme: ResolvedTheme) => {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    applyTheme(resolvedTheme);

    // Observe VS Code theme changes via body data attribute
    const observer = new MutationObserver(() => {
      const newTheme = detectVscodeTheme();
      setResolvedTheme(newTheme);
      applyTheme(newTheme);
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-vscode-theme-kind"],
    });

    return () => observer.disconnect();
  }, [resolvedTheme]);

  const setTheme = useCallback(() => {
    // No-op: theme is controlled by VS Code
  }, []);

  return { theme: "system", resolvedTheme, setTheme };
}
