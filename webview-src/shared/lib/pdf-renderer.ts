import * as pdfjsLib from "pdfjs-dist";

// Import worker module directly so it registers globalThis.pdfjsWorker.
// pdfjs-dist detects this and uses the main-thread handler instead of
// spawning a Web Worker (which fails in VS Code webview due to CSP).
import "pdfjs-dist/build/pdf.worker.min.mjs";

const THUMBNAIL_SCALE = 0.5;

export async function renderPageThumbnail(
  data: ArrayBuffer,
  pageNumber: number,
  scale = THUMBNAIL_SCALE,
): Promise<string> {
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const ctx = canvas.getContext("2d")!;
  await page.render({ canvas, canvasContext: ctx, viewport }).promise;

  const dataUrl = canvas.toDataURL("image/png");
  pdf.destroy();
  return dataUrl;
}

export async function renderAllThumbnails(
  data: ArrayBuffer,
  scale = THUMBNAIL_SCALE,
): Promise<string[]> {
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const thumbnails: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext("2d")!;
    await page.render({ canvas, canvasContext: ctx, viewport }).promise;

    thumbnails.push(canvas.toDataURL("image/png"));
  }

  pdf.destroy();
  return thumbnails;
}
