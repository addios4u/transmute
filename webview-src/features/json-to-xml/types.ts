export interface ConversionOptions {
  rootElementName: string;
  indent: number;
  xmlDeclaration: boolean;
}

export const DEFAULT_OPTIONS: ConversionOptions = {
  rootElementName: "root",
  indent: 2,
  xmlDeclaration: true,
};

export interface ConversionResult {
  xml: string;
  error?: string;
}
