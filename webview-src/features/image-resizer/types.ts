import type { OutputFormat } from "@/features/image-converter/types";

export type { OutputFormat };

export type ResizeMode = "ratio" | "maxDimension";

export interface ResizeOptions {
  mode: ResizeMode;
  ratio: number; // 0.1 ~ 1.0
  maxWidth: number; // px
  maxHeight: number; // px
  outputFormat: OutputFormat;
  quality: number; // 0.1 ~ 1.0
}

export const DEFAULT_OPTIONS: ResizeOptions = {
  mode: "ratio",
  ratio: 0.5,
  maxWidth: 1920,
  maxHeight: 1080,
  outputFormat: "image/jpeg",
  quality: 0.85,
};

export interface ResizeResult {
  blob: Blob;
  fileName: string;
  width: number;
  height: number;
}

export interface ResizeFileItem {
  id: string;
  file: File;
  preview: string;
  originalWidth: number;
  originalHeight: number;
  status: "pending" | "processing" | "done" | "error";
  result?: ResizeResult;
}
