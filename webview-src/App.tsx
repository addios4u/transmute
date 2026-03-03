import { useState, lazy, Suspense } from "react";
import { Layout } from "@/shared/components/Layout";
import { ThemeContext, useVscodeTheme } from "@/shared/hooks/useTheme";
import { getState, setState } from "@/vscode-api";

// Lazy-loaded feature pages
const JsonFormatterPage = lazy(() => import("@/features/json-formatter").then((m) => ({ default: m.JsonFormatterPage })));
const JsonToTsPage = lazy(() => import("@/features/json-to-ts").then((m) => ({ default: m.JsonToTsPage })));
const JsonToXmlPage = lazy(() => import("@/features/json-to-xml").then((m) => ({ default: m.JsonToXmlPage })));
const XmlToJsonPage = lazy(() => import("@/features/xml-to-json").then((m) => ({ default: m.XmlToJsonPage })));
const ImageConverterPage = lazy(() => import("@/features/image-converter").then((m) => ({ default: m.ImageConverterPage })));
const ImageResizerPage = lazy(() => import("@/features/image-resizer").then((m) => ({ default: m.ImageResizerPage })));
const ImageToBase64Page = lazy(() => import("@/features/image-to-base64").then((m) => ({ default: m.ImageToBase64Page })));
const Base64ToImagePage = lazy(() => import("@/features/base64-to-image").then((m) => ({ default: m.Base64ToImagePage })));
const PdfMergePage = lazy(() => import("@/features/pdf-merge").then((m) => ({ default: m.PdfMergePage })));
const PdfSplitPage = lazy(() => import("@/features/pdf-split").then((m) => ({ default: m.PdfSplitPage })));
const UrlEncoderPage = lazy(() => import("@/features/url-encoder").then((m) => ({ default: m.UrlEncoderPage })));
const HashGeneratorPage = lazy(() => import("@/features/hash-generator").then((m) => ({ default: m.HashGeneratorPage })));
const UuidGeneratorPage = lazy(() => import("@/features/uuid-generator").then((m) => ({ default: m.UuidGeneratorPage })));
const TimestampConverterPage = lazy(() => import("@/features/timestamp-converter").then((m) => ({ default: m.TimestampConverterPage })));
const JwtDecoderPage = lazy(() => import("@/features/jwt-decoder").then((m) => ({ default: m.JwtDecoderPage })));
const RegexTesterPage = lazy(() => import("@/features/regex-tester").then((m) => ({ default: m.RegexTesterPage })));
const DiffCheckerPage = lazy(() => import("@/features/diff-checker").then((m) => ({ default: m.DiffCheckerPage })));
const ColorConverterPage = lazy(() => import("@/features/color-converter").then((m) => ({ default: m.ColorConverterPage })));
const CsvJsonPage = lazy(() => import("@/features/csv-json").then((m) => ({ default: m.CsvJsonPage })));

const TOOL_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  "json-formatter": JsonFormatterPage,
  "json-to-ts": JsonToTsPage,
  "json-to-xml": JsonToXmlPage,
  "xml-to-json": XmlToJsonPage,
  "image-converter": ImageConverterPage,
  "image-resizer": ImageResizerPage,
  "image-to-base64": ImageToBase64Page,
  "base64-to-image": Base64ToImagePage,
  "pdf-merge": PdfMergePage,
  "pdf-split": PdfSplitPage,
  "url-encoder": UrlEncoderPage,
  "hash-generator": HashGeneratorPage,
  "uuid-generator": UuidGeneratorPage,
  "timestamp-converter": TimestampConverterPage,
  "jwt-decoder": JwtDecoderPage,
  "regex-tester": RegexTesterPage,
  "diff-checker": DiffCheckerPage,
  "color-converter": ColorConverterPage,
  "csv-json": CsvJsonPage,
};

function LoadingFallback() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-text-secondary">Loading...</div>
    </div>
  );
}

export function App() {
  const themeValue = useVscodeTheme();

  // Persist active tool in VS Code state
  const savedState = getState<{ activeTool?: string }>();
  const [activeTool, setActiveTool] = useState(savedState?.activeTool ?? "json-formatter");

  const handleToolSelect = (path: string) => {
    setActiveTool(path);
    setState({ activeTool: path });
  };

  const ActiveComponent = TOOL_COMPONENTS[activeTool];

  return (
    <ThemeContext.Provider value={themeValue}>
      <Layout activeTool={activeTool} onToolSelect={handleToolSelect}>
        <Suspense fallback={<LoadingFallback />}>
          {ActiveComponent ? <ActiveComponent /> : <LoadingFallback />}
        </Suspense>
      </Layout>
    </ThemeContext.Provider>
  );
}
