import { useTranslation } from "react-i18next";
import { TOOL_GROUPS } from "@/shared/lib/tools";
import { ToolIcon } from "./ToolIcon";

interface SidebarProps {
  activeTool: string;
  onToolSelect: (path: string) => void;
}

export function Sidebar({ activeTool, onToolSelect }: SidebarProps) {
  const { t } = useTranslation();

  return (
    <nav className="w-56 shrink-0 overflow-y-auto border-r border-border/50 bg-bg-secondary/50 p-4">
      <div className="flex flex-col gap-5">
        {TOOL_GROUPS.map((group) => (
          <div key={group.groupKey}>
            <h3 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">
              {t(group.groupKey)}
            </h3>
            <ul className="flex flex-col gap-1">
              {group.tools.map((tool) => {
                const isActive = activeTool === tool.path;
                return (
                  <li key={tool.path}>
                    <button
                      onClick={() => onToolSelect(tool.path)}
                      className={`relative flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-accent/10 font-medium text-accent shadow-sm"
                          : "text-text-secondary hover:bg-bg-tertiary/80 hover:text-text-primary"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-accent" />
                      )}
                      <ToolIcon
                        iconId={tool.iconId}
                        className="h-4 w-4 shrink-0"
                      />
                      <span>{t(tool.titleKey)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
