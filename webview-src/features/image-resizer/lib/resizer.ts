import JSZip from "jszip";
import {
  loadImageFromFile,
  replaceExtension,
} from "@/features/image-converter/lib/converter";
import { FORMAT_EXTENSIONS } from "@/features/image-converter/types";
import type { ResizeOptions, ResizeResult, OutputFormat } from "../types";

export function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  options: ResizeOptions,
): { width: number; height: number } {
  if (options.mode === "ratio") {
    return {
      width: Math.round(originalWidth * options.ratio),
      height: Math.round(originalHeight * options.ratio),
    };
  }

  // maxDimension mode — maintain aspect ratio
  const { maxWidth, maxHeight } = options;
  const ratioW = maxWidth / originalWidth;
  const ratioH = maxHeight / originalHeight;
  const scale = Math.min(ratioW, ratioH, 1); // never upscale

  return {
    width: Math.round(originalWidth * scale),
    height: Math.round(originalHeight * scale),
  };
}

export function resizeImage(
  img: HTMLImageElement,
  width: number,
  height: number,
  outputFormat: OutputFormat,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    if (outputFormat === "image/jpeg") {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(img, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to resize image"));
          return;
        }
        resolve(blob);
      },
      outputFormat,
      outputFormat === "image/png" ? undefined : quality,
    );
  });
}

export async function processFile(
  file: File,
  options: ResizeOptions,
): Promise<ResizeResult> {
  const img = await loadImageFromFile(file);
  const { width, height } = calculateDimensions(
    img.naturalWidth,
    img.naturalHeight,
    options,
  );
  const blob = await resizeImage(
    img,
    width,
    height,
    options.outputFormat,
    options.quality,
  );
  const extension = FORMAT_EXTENSIONS[options.outputFormat];

  return {
    blob,
    fileName: replaceExtension(file.name, extension),
    width,
    height,
  };
}

export async function createZip(
  results: ResizeResult[],
): Promise<Blob> {
  const zip = new JSZip();
  for (const result of results) {
    zip.file(result.fileName, result.blob);
  }
  return zip.generateAsync({ type: "blob" });
}

const IMAGE_MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".bmp": "image/bmp",
  ".svg": "image/svg+xml",
};

function getImageMimeType(fileName: string): string | null {
  const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  return IMAGE_MIME_TYPES[ext] ?? null;
}

export async function extractImagesFromZip(zipFile: File): Promise<File[]> {
  const zip = await JSZip.loadAsync(zipFile);
  const imageFiles: File[] = [];

  for (const [path, entry] of Object.entries(zip.files)) {
    if (entry.dir) continue;

    const fileName = path.split("/").pop() ?? path;
    // Skip hidden files and macOS resource forks
    if (fileName.startsWith(".") || path.includes("__MACOSX")) continue;

    const mimeType = getImageMimeType(fileName);
    if (!mimeType) continue;

    const blob = await entry.async("blob");
    imageFiles.push(new File([blob], fileName, { type: mimeType }));
  }

  return imageFiles;
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
