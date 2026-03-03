import type { OutputFormat, ConversionResult } from "../types";
import { FORMAT_EXTENSIONS } from "../types";

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

export function convertImage(
  img: HTMLImageElement,
  outputFormat: OutputFormat,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    // JPEG does not support transparency — fill white background
    if (outputFormat === "image/jpeg") {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to convert image"));
          return;
        }
        resolve(blob);
      },
      outputFormat,
      outputFormat === "image/png" ? undefined : quality,
    );
  });
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read blob"));
    reader.readAsDataURL(blob);
  });
}

export function replaceExtension(
  originalName: string,
  newExtension: string,
): string {
  const dotIndex = originalName.lastIndexOf(".");
  const baseName =
    dotIndex > 0 ? originalName.slice(0, dotIndex) : originalName;
  return `${baseName}${newExtension}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function processImageConversion(
  file: File,
  outputFormat: OutputFormat,
  quality: number,
): Promise<ConversionResult> {
  const img = await loadImageFromFile(file);
  const blob = await convertImage(img, outputFormat, quality);
  const dataUrl = await blobToDataUrl(blob);
  const extension = FORMAT_EXTENSIONS[outputFormat];

  return {
    blob,
    dataUrl,
    fileName: replaceExtension(file.name, extension),
    originalSize: file.size,
    convertedSize: blob.size,
    width: img.naturalWidth,
    height: img.naturalHeight,
  };
}
