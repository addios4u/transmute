export interface ConversionOptions {
  rootTypeName: string;
  useInterface: boolean;
  optionalProperties: "strict" | "loose";
  arrayInference: "first" | "merge";
  outputZod: boolean;
}

export const DEFAULT_OPTIONS: ConversionOptions = {
  rootTypeName: "Root",
  useInterface: false,
  optionalProperties: "strict",
  arrayInference: "first",
  outputZod: false,
};
