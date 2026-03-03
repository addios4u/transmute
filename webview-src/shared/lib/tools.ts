export type IconId = "code" | "image-up" | "image-down" | "image-convert" | "image-resize" | "pdf-merge" | "pdf-split" | "jwt" | "regex" | "diff" | "color" | "csv" | "json-format" | "url-encode" | "hash" | "uuid" | "timestamp";

export interface ToolDefinition {
  path: string;
  titleKey: string;
  descriptionKey: string;
  iconId: IconId;
}

export interface ToolGroup {
  groupKey: string;
  tools: ToolDefinition[];
}

export const TOOL_GROUPS: ToolGroup[] = [
  {
    groupKey: "groups.base64",
    tools: [
      {
        path: "image-to-base64",
        titleKey: "tools.imageToBase64.title",
        descriptionKey: "tools.imageToBase64.description",
        iconId: "image-up",
      },
      {
        path: "base64-to-image",
        titleKey: "tools.base64ToImage.title",
        descriptionKey: "tools.base64ToImage.description",
        iconId: "image-down",
      },
    ],
  },
  {
    groupKey: "groups.json",
    tools: [
      {
        path: "json-formatter",
        titleKey: "tools.jsonFormatter.title",
        descriptionKey: "tools.jsonFormatter.description",
        iconId: "json-format",
      },
      {
        path: "json-to-ts",
        titleKey: "tools.jsonToTs.title",
        descriptionKey: "tools.jsonToTs.description",
        iconId: "code",
      },
      {
        path: "json-to-xml",
        titleKey: "tools.jsonToXml.title",
        descriptionKey: "tools.jsonToXml.description",
        iconId: "code",
      },
      {
        path: "xml-to-json",
        titleKey: "tools.xmlToJson.title",
        descriptionKey: "tools.xmlToJson.description",
        iconId: "code",
      },
    ],
  },
  {
    groupKey: "groups.image",
    tools: [
      {
        path: "image-converter",
        titleKey: "tools.imageConverter.title",
        descriptionKey: "tools.imageConverter.description",
        iconId: "image-convert",
      },
      {
        path: "image-resizer",
        titleKey: "tools.imageResizer.title",
        descriptionKey: "tools.imageResizer.description",
        iconId: "image-resize",
      },
    ],
  },
  {
    groupKey: "groups.pdf",
    tools: [
      {
        path: "pdf-merge",
        titleKey: "tools.pdfMerge.title",
        descriptionKey: "tools.pdfMerge.description",
        iconId: "pdf-merge",
      },
      {
        path: "pdf-split",
        titleKey: "tools.pdfSplit.title",
        descriptionKey: "tools.pdfSplit.description",
        iconId: "pdf-split",
      },
    ],
  },
  {
    groupKey: "groups.utility",
    tools: [
      {
        path: "url-encoder",
        titleKey: "tools.urlEncoder.title",
        descriptionKey: "tools.urlEncoder.description",
        iconId: "url-encode",
      },
      {
        path: "hash-generator",
        titleKey: "tools.hashGenerator.title",
        descriptionKey: "tools.hashGenerator.description",
        iconId: "hash",
      },
      {
        path: "uuid-generator",
        titleKey: "tools.uuidGenerator.title",
        descriptionKey: "tools.uuidGenerator.description",
        iconId: "uuid",
      },
      {
        path: "timestamp-converter",
        titleKey: "tools.timestampConverter.title",
        descriptionKey: "tools.timestampConverter.description",
        iconId: "timestamp",
      },
    ],
  },
  {
    groupKey: "groups.developer",
    tools: [
      {
        path: "jwt-decoder",
        titleKey: "tools.jwtDecoder.title",
        descriptionKey: "tools.jwtDecoder.description",
        iconId: "jwt",
      },
      {
        path: "regex-tester",
        titleKey: "tools.regexTester.title",
        descriptionKey: "tools.regexTester.description",
        iconId: "regex",
      },
      {
        path: "diff-checker",
        titleKey: "tools.diffChecker.title",
        descriptionKey: "tools.diffChecker.description",
        iconId: "diff",
      },
      {
        path: "color-converter",
        titleKey: "tools.colorConverter.title",
        descriptionKey: "tools.colorConverter.description",
        iconId: "color",
      },
      {
        path: "csv-json",
        titleKey: "tools.csvJson.title",
        descriptionKey: "tools.csvJson.description",
        iconId: "csv",
      },
    ],
  },
];

export const TOOLS: ToolDefinition[] = TOOL_GROUPS.flatMap(
  (group) => group.tools,
);
