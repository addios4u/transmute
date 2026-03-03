// @vitest-environment node
import { describe, it, expect } from "vitest";
import { replaceExtension, formatFileSize } from "./converter";

describe("replaceExtension", () => {
  it("should replace existing extension", () => {
    expect(replaceExtension("photo.png", ".jpg")).toBe("photo.jpg");
  });

  it("should handle files with multiple dots", () => {
    expect(replaceExtension("my.photo.png", ".webp")).toBe("my.photo.webp");
  });

  it("should add extension when none exists", () => {
    expect(replaceExtension("photo", ".png")).toBe("photo.png");
  });

  it("should handle hidden files", () => {
    expect(replaceExtension(".gitignore", ".png")).toBe(".gitignore.png");
  });
});

describe("formatFileSize", () => {
  it("should format bytes", () => {
    expect(formatFileSize(500)).toBe("500 B");
  });

  it("should format kilobytes", () => {
    expect(formatFileSize(1536)).toBe("1.5 KB");
  });

  it("should format megabytes", () => {
    expect(formatFileSize(2621440)).toBe("2.5 MB");
  });

  it("should format zero bytes", () => {
    expect(formatFileSize(0)).toBe("0 B");
  });

  it("should format exactly 1 KB", () => {
    expect(formatFileSize(1024)).toBe("1.0 KB");
  });

  it("should format exactly 1 MB", () => {
    expect(formatFileSize(1048576)).toBe("1.0 MB");
  });
});
