// @vitest-environment node
import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import {
  parsePageRange,
  getPageCount,
  extractPages,
  splitToIndividualPages,
} from "./splitter";

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

describe("parsePageRange", () => {
  it("parses single pages", () => {
    expect(parsePageRange("1, 3, 5", 10)).toEqual([1, 3, 5]);
  });

  it("parses ranges", () => {
    expect(parsePageRange("1-3", 10)).toEqual([1, 2, 3]);
  });

  it("parses mixed input", () => {
    expect(parsePageRange("1-3, 5, 7-9", 10)).toEqual([1, 2, 3, 5, 7, 8, 9]);
  });

  it("deduplicates overlapping ranges", () => {
    expect(parsePageRange("1-3, 2-4", 10)).toEqual([1, 2, 3, 4]);
  });

  it("ignores out-of-range pages", () => {
    expect(parsePageRange("0, 5, 11", 10)).toEqual([5]);
  });

  it("ignores invalid ranges", () => {
    expect(parsePageRange("5-3", 10)).toEqual([]);
  });

  it("handles empty input", () => {
    expect(parsePageRange("", 10)).toEqual([]);
  });

  it("handles whitespace", () => {
    expect(parsePageRange("  1 - 3 , 5 ", 10)).toEqual([1, 2, 3, 5]);
  });
});

describe("getPageCount", () => {
  it("returns correct count", async () => {
    const file = await createTestPdf(5);
    expect(await getPageCount(file)).toBe(5);
  });
});

describe("extractPages", () => {
  it("extracts selected pages", async () => {
    const file = await createTestPdf(5);
    const blob = await extractPages(file, [1, 3, 5]);

    const doc = await PDFDocument.load(await blob.arrayBuffer());
    expect(doc.getPageCount()).toBe(3);
  });

  it("extracts a single page", async () => {
    const file = await createTestPdf(5);
    const blob = await extractPages(file, [2]);

    const doc = await PDFDocument.load(await blob.arrayBuffer());
    expect(doc.getPageCount()).toBe(1);
  });
});

describe("splitToIndividualPages", () => {
  it("splits into individual pages", async () => {
    const file = await createTestPdf(3);
    const results = await splitToIndividualPages(file);

    expect(results).toHaveLength(3);
    expect(results[0]!.fileName).toBe("test-3pages_page1.pdf");
    expect(results[1]!.fileName).toBe("test-3pages_page2.pdf");
    expect(results[2]!.fileName).toBe("test-3pages_page3.pdf");

    for (const result of results) {
      const doc = await PDFDocument.load(await result.blob.arrayBuffer());
      expect(doc.getPageCount()).toBe(1);
    }
  });
});
