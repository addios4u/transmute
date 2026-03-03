import { useState, useRef, useEffect, useCallback } from "react";

export interface FormSelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  value: string | number;
  onChange: (value: string) => void;
  options: FormSelectOption[];
  className?: string;
}

export function FormSelect({ value, onChange, options, className }: FormSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [focusIndex, setFocusIndex] = useState(-1);

  const selectedLabel =
    options.find((o) => String(o.value) === String(value))?.label ?? "";

  const close = useCallback(() => {
    setIsOpen(false);
    setFocusIndex(-1);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen && focusIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll("[role='option']");
      (items[focusIndex] as HTMLElement)?.scrollIntoView({ block: "nearest" });
    }
  }, [focusIndex, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusIndex(options.findIndex((o) => String(o.value) === String(value)));
        } else if (focusIndex >= 0 && options[focusIndex]) {
          onChange(options[focusIndex].value);
          close();
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusIndex(options.findIndex((o) => String(o.value) === String(value)));
        } else {
          setFocusIndex((prev) => Math.min(prev + 1, options.length - 1));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setFocusIndex((prev) => Math.max(prev - 1, 0));
        }
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) {
            setFocusIndex(options.findIndex((o) => String(o.value) === String(value)));
          }
        }}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 rounded-md border border-border bg-bg-primary py-1.5 pl-3 pr-8 text-left text-sm text-text-primary transition-all hover:border-border-hover focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      >
        {selectedLabel}
      </button>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary transition-transform ${isOpen ? "rotate-180" : ""}`}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          onKeyDown={handleKeyDown}
          className="absolute left-0 top-full z-50 mt-1 max-h-60 min-w-full overflow-auto rounded-lg border border-border bg-bg-primary py-1 shadow-lg"
        >
          {options.map((option, i) => {
            const isSelected = String(option.value) === String(value);
            const isFocused = i === focusIndex;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setFocusIndex(i)}
                onClick={() => {
                  onChange(option.value);
                  close();
                }}
                className={`cursor-pointer px-3 py-1.5 text-sm transition-colors ${
                  isFocused
                    ? "bg-accent/10 text-accent"
                    : isSelected
                      ? "text-accent"
                      : "text-text-primary hover:bg-bg-tertiary/50"
                }`}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
