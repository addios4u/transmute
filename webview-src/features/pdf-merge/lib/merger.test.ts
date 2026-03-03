// @vitest-environment node
import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { mergePDFs, getPageCount } from "./merger";

class MockFile extends Blob {
  name: string;
  lastModified: number;
  webkitRelativePath: string;

  constructor(bits: BlobPart[], name: string, options?: FilePropertyBag) {
    super(bits, options);
    this.name = name;
    this.lastModified = Date.now();
    this.webkitRelativePath = "";
  }
}

async function createTestPdf(pageCount: number): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    doc.addPage();
  }
  const bytes = await doc.save();
  return new MockFile(
    [bytes.buffer as ArrayBuffer],
    `test-${pageCount}pages.pdf`,
    { type: "application/pdf" },
  ) as unknown as File;
}

describe("getPageCount", () => {
  it("returns the correct page count", async () => {
    const file = await createTestPdf(3);
    const count = await getPageCount(file);
    expect(count).toBe(3);
  });

  it("returns 1 for a single page PDF", async () => {
    const file = await createTestPdf(1);
    const count = await getPageCount(file);
    expect(count).toBe(1);
  });
});

describe("mergePDFs", () => {
  it("merges multiple PDFs into one", async () => {
    const file1 = await createTestPdf(2);
    const file2 = await createTestPdf(3);

    const mergedBlob = await mergePDFs([file1, file2]);
    expect(mergedBlob).toBeInstanceOf(Blob);
    expect(mergedBlob.type).toBe("application/pdf");

    const mergedDoc = await PDFDocument.load(await mergedBlob.arrayBuffer());
    expect(mergedDoc.getPageCount()).toBe(5);
  });

  it("handles a single file", async () => {
    const file = await createTestPdf(4);
    const mergedBlob = await mergePDFs([file]);

    const mergedDoc = await PDFDocument.load(await mergedBlob.arrayBuffer());
    expect(mergedDoc.getPageCount()).toBe(4);
  });

  it("handles empty array", async () => {
    const mergedBlob = await mergePDFs([]);
    expect(mergedBlob).toBeInstanceOf(Blob);
    expect(mergedBlob.type).toBe("application/pdf");
  });
});
