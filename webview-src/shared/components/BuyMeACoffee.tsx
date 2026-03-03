import { useCallback } from "react";
import { postMessage } from "@/vscode-api";

const BMC_URL = "https://buymeacoffee.com/addios4u";

interface BuyMeACoffeeProps {
  style?: React.CSSProperties;
}

export function BuyMeACoffee({ style }: BuyMeACoffeeProps) {
  const handleClick = useCallback(() => {
    postMessage({ type: "openExternal", url: BMC_URL });
  }, []);

  return (
    <button
      onClick={handleClick}
      style={style}
      className="inline-flex items-center gap-1.5 rounded-md bg-[#FFDD00] px-3 py-1.5 text-xs font-semibold text-[#000000] shadow-sm transition-all hover:brightness-95 active:scale-95"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
      >
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
        <line x1="6" x2="6" y1="2" y2="4" />
        <line x1="10" x2="10" y1="2" y2="4" />
        <line x1="14" x2="14" y1="2" y2="4" />
      </svg>
      Buy me a coffee
    </button>
  );
}
