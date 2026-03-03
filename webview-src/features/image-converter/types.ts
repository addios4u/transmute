export type OutputFormat = "image/png" | "image/jpeg" | "image/webp";

export interface ConversionOptions {
  outputFormat: OutputFormat;
  quality: number; // 0.0 ~ 1.0, ignored for PNG
}

export const DEFAULT_OPTIONS: ConversionOptions = {
  outputFormat: "image/png",
  quality: 0.92,
};

export interface ConversionResult {
  blob: Blob;
  dataUrl: string;
  fileName: string;
  originalSize: number;
  convertedSize: number;
  width: number;
  height: number;
}

export const FORMAT_EXTENSIONS: Record<OutputFormat, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
};

export const FORMAT_LABELS: Record<OutputFormat, string> = {
  "image/png": "PNG",
  "image/jpeg": "JPEG",
  "image/webp": "WebP",
};
