export type SplitMode = "range" | "individual";

export interface SplitOptions {
  mode: SplitMode;
  pageRange: string; // e.g., "1-3, 5, 7-9"
}

export const DEFAULT_OPTIONS: SplitOptions = {
  mode: "range",
  pageRange: "",
};
