import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

export async function getPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  return pdf.getPageCount();
}

export function parsePageRange(input: string, totalPages: number): number[] {
  const pages = new Set<number>();

  const parts = input.split(",").map((s) => s.trim()).filter(Boolean);

  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1]!, 10);
      const end = parseInt(rangeMatch[2]!, 10);
      if (start < 1 || end > totalPages || start > end) continue;
      for (let i = start; i <= end; i++) {
        pages.add(i);
      }
    } else {
      const num = parseInt(part, 10);
      if (num >= 1 && num <= totalPages) {
        pages.add(num);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

export async function extractPages(
  file: File,
  pageNumbers: number[],
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const newPdf = await PDFDocument.create();

  // pageNumbers are 1-based, copyPages needs 0-based indices
  const indices = pageNumbers.map((n) => n - 1);
  const pages = await newPdf.copyPages(sourcePdf, indices);
  for (const page of pages) {
    newPdf.addPage(page);
  }

  const pdfBytes = await newPdf.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
}

export async function splitToIndividualPages(
  file: File,
): Promise<{ blob: Blob; fileName: string }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = sourcePdf.getPageCount();
  const baseName = file.name.replace(/\.pdf$/i, "");
  const results: { blob: Blob; fileName: string }[] = [];

  for (let i = 0; i < totalPages; i++) {
    const newPdf = await PDFDocument.create();
    const [page] = await newPdf.copyPages(sourcePdf, [i]);
    newPdf.addPage(page!);
    const pdfBytes = await newPdf.save();
    results.push({
      blob: new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }),
      fileName: `${baseName}_page${i + 1}.pdf`,
    });
  }

  return results;
}

export async function createZip(
  files: { blob: Blob; fileName: string }[],
): Promise<Blob> {
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.fileName, file.blob);
  }
  return zip.generateAsync({ type: "blob" });
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
