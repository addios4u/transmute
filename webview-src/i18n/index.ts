import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import enJsonToTs from "./locales/en/json-to-ts.json";
import enImageToBase64 from "./locales/en/image-to-base64.json";
import enBase64ToImage from "./locales/en/base64-to-image.json";
import enJsonToXml from "./locales/en/json-to-xml.json";
import enXmlToJson from "./locales/en/xml-to-json.json";
import enImageConverter from "./locales/en/image-converter.json";
import enImageResizer from "./locales/en/image-resizer.json";
import enPdfMerge from "./locales/en/pdf-merge.json";
import enPdfSplit from "./locales/en/pdf-split.json";
import enJwtDecoder from "./locales/en/jwt-decoder.json";
import enRegexTester from "./locales/en/regex-tester.json";
import enDiffChecker from "./locales/en/diff-checker.json";
import enColorConverter from "./locales/en/color-converter.json";
import enCsvJson from "./locales/en/csv-json.json";
import enJsonFormatter from "./locales/en/json-formatter.json";
import enUrlEncoder from "./locales/en/url-encoder.json";
import enHashGenerator from "./locales/en/hash-generator.json";
import enUuidGenerator from "./locales/en/uuid-generator.json";
import enTimestampConverter from "./locales/en/timestamp-converter.json";

import koCommon from "./locales/ko/common.json";
import koJsonToTs from "./locales/ko/json-to-ts.json";
import koImageToBase64 from "./locales/ko/image-to-base64.json";
import koBase64ToImage from "./locales/ko/base64-to-image.json";
import koJsonToXml from "./locales/ko/json-to-xml.json";
import koXmlToJson from "./locales/ko/xml-to-json.json";
import koImageConverter from "./locales/ko/image-converter.json";
import koImageResizer from "./locales/ko/image-resizer.json";
import koPdfMerge from "./locales/ko/pdf-merge.json";
import koPdfSplit from "./locales/ko/pdf-split.json";
import koJwtDecoder from "./locales/ko/jwt-decoder.json";
import koRegexTester from "./locales/ko/regex-tester.json";
import koDiffChecker from "./locales/ko/diff-checker.json";
import koColorConverter from "./locales/ko/color-converter.json";
import koCsvJson from "./locales/ko/csv-json.json";
import koJsonFormatter from "./locales/ko/json-formatter.json";
import koUrlEncoder from "./locales/ko/url-encoder.json";
import koHashGenerator from "./locales/ko/hash-generator.json";
import koUuidGenerator from "./locales/ko/uuid-generator.json";
import koTimestampConverter from "./locales/ko/timestamp-converter.json";

import jaCommon from "./locales/ja/common.json";
import jaJsonToTs from "./locales/ja/json-to-ts.json";
import jaImageToBase64 from "./locales/ja/image-to-base64.json";
import jaBase64ToImage from "./locales/ja/base64-to-image.json";
import jaJsonToXml from "./locales/ja/json-to-xml.json";
import jaXmlToJson from "./locales/ja/xml-to-json.json";
import jaImageConverter from "./locales/ja/image-converter.json";
import jaImageResizer from "./locales/ja/image-resizer.json";
import jaPdfMerge from "./locales/ja/pdf-merge.json";
import jaPdfSplit from "./locales/ja/pdf-split.json";
import jaJwtDecoder from "./locales/ja/jwt-decoder.json";
import jaRegexTester from "./locales/ja/regex-tester.json";
import jaDiffChecker from "./locales/ja/diff-checker.json";
import jaColorConverter from "./locales/ja/color-converter.json";
import jaCsvJson from "./locales/ja/csv-json.json";
import jaJsonFormatter from "./locales/ja/json-formatter.json";
import jaUrlEncoder from "./locales/ja/url-encoder.json";
import jaHashGenerator from "./locales/ja/hash-generator.json";
import jaUuidGenerator from "./locales/ja/uuid-generator.json";
import jaTimestampConverter from "./locales/ja/timestamp-converter.json";

import zhCommon from "./locales/zh/common.json";
import zhJsonToTs from "./locales/zh/json-to-ts.json";
import zhImageToBase64 from "./locales/zh/image-to-base64.json";
import zhBase64ToImage from "./locales/zh/base64-to-image.json";
import zhJsonToXml from "./locales/zh/json-to-xml.json";
import zhXmlToJson from "./locales/zh/xml-to-json.json";
import zhImageConverter from "./locales/zh/image-converter.json";
import zhImageResizer from "./locales/zh/image-resizer.json";
import zhPdfMerge from "./locales/zh/pdf-merge.json";
import zhPdfSplit from "./locales/zh/pdf-split.json";
import zhJwtDecoder from "./locales/zh/jwt-decoder.json";
import zhRegexTester from "./locales/zh/regex-tester.json";
import zhDiffChecker from "./locales/zh/diff-checker.json";
import zhColorConverter from "./locales/zh/color-converter.json";
import zhCsvJson from "./locales/zh/csv-json.json";
import zhJsonFormatter from "./locales/zh/json-formatter.json";
import zhUrlEncoder from "./locales/zh/url-encoder.json";
import zhHashGenerator from "./locales/zh/hash-generator.json";
import zhUuidGenerator from "./locales/zh/uuid-generator.json";
import zhTimestampConverter from "./locales/zh/timestamp-converter.json";

const resources = {
  en: {
    common: enCommon,
    "json-to-ts": enJsonToTs,
    "image-to-base64": enImageToBase64,
    "base64-to-image": enBase64ToImage,
    "json-to-xml": enJsonToXml,
    "xml-to-json": enXmlToJson,
    "image-converter": enImageConverter,
    "image-resizer": enImageResizer,
    "pdf-merge": enPdfMerge,
    "pdf-split": enPdfSplit,
    "jwt-decoder": enJwtDecoder,
    "regex-tester": enRegexTester,
    "diff-checker": enDiffChecker,
    "color-converter": enColorConverter,
    "csv-json": enCsvJson,
    "json-formatter": enJsonFormatter,
    "url-encoder": enUrlEncoder,
    "hash-generator": enHashGenerator,
    "uuid-generator": enUuidGenerator,
    "timestamp-converter": enTimestampConverter,
  },
  ko: {
    common: koCommon,
    "json-to-ts": koJsonToTs,
    "image-to-base64": koImageToBase64,
    "base64-to-image": koBase64ToImage,
    "json-to-xml": koJsonToXml,
    "xml-to-json": koXmlToJson,
    "image-converter": koImageConverter,
    "image-resizer": koImageResizer,
    "pdf-merge": koPdfMerge,
    "pdf-split": koPdfSplit,
    "jwt-decoder": koJwtDecoder,
    "regex-tester": koRegexTester,
    "diff-checker": koDiffChecker,
    "color-converter": koColorConverter,
    "csv-json": koCsvJson,
    "json-formatter": koJsonFormatter,
    "url-encoder": koUrlEncoder,
    "hash-generator": koHashGenerator,
    "uuid-generator": koUuidGenerator,
    "timestamp-converter": koTimestampConverter,
  },
  ja: {
    common: jaCommon,
    "json-to-ts": jaJsonToTs,
    "image-to-base64": jaImageToBase64,
    "base64-to-image": jaBase64ToImage,
    "json-to-xml": jaJsonToXml,
    "xml-to-json": jaXmlToJson,
    "image-converter": jaImageConverter,
    "image-resizer": jaImageResizer,
    "pdf-merge": jaPdfMerge,
    "pdf-split": jaPdfSplit,
    "jwt-decoder": jaJwtDecoder,
    "regex-tester": jaRegexTester,
    "diff-checker": jaDiffChecker,
    "color-converter": jaColorConverter,
    "csv-json": jaCsvJson,
    "json-formatter": jaJsonFormatter,
    "url-encoder": jaUrlEncoder,
    "hash-generator": jaHashGenerator,
    "uuid-generator": jaUuidGenerator,
    "timestamp-converter": jaTimestampConverter,
  },
  zh: {
    common: zhCommon,
    "json-to-ts": zhJsonToTs,
    "image-to-base64": zhImageToBase64,
    "base64-to-image": zhBase64ToImage,
    "json-to-xml": zhJsonToXml,
    "xml-to-json": zhXmlToJson,
    "image-converter": zhImageConverter,
    "image-resizer": zhImageResizer,
    "pdf-merge": zhPdfMerge,
    "pdf-split": zhPdfSplit,
    "jwt-decoder": zhJwtDecoder,
    "regex-tester": zhRegexTester,
    "diff-checker": zhDiffChecker,
    "color-converter": zhColorConverter,
    "csv-json": zhCsvJson,
    "json-formatter": zhJsonFormatter,
    "url-encoder": zhUrlEncoder,
    "hash-generator": zhHashGenerator,
    "uuid-generator": zhUuidGenerator,
    "timestamp-converter": zhTimestampConverter,
  },
};

// Detect locale from VS Code initial state
const initialLocale = (() => {
  try {
    const state = window.__INITIAL_STATE__;
    if (state?.locale) {
      // VS Code locale format: "ko", "ja", "zh-cn", etc.
      // Map to i18next supported languages
      const locale = state.locale.toLowerCase();
      if (locale.startsWith("ko")) return "ko";
      if (locale.startsWith("ja")) return "ja";
      if (locale.startsWith("zh")) return "zh";
      return "en";
    }
  } catch {
    // Not in VS Code environment
  }
  return "en";
})();

i18n.use(initReactI18next).init({
  resources,
  lng: initialLocale,
  fallbackLng: "en",
  supportedLngs: ["en", "ko", "ja", "zh"],
  defaultNS: "common",
  ns: [
    "common",
    "json-to-ts",
    "image-to-base64",
    "base64-to-image",
    "json-to-xml",
    "xml-to-json",
    "image-converter",
    "image-resizer",
    "pdf-merge",
    "pdf-split",
    "jwt-decoder",
    "regex-tester",
    "diff-checker",
    "color-converter",
    "csv-json",
    "json-formatter",
    "url-encoder",
    "hash-generator",
    "uuid-generator",
    "timestamp-converter",
  ],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
