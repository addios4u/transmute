export interface ConversionOptions {
  indent: number;
}

export const DEFAULT_OPTIONS: ConversionOptions = {
  indent: 2,
};

export interface ConversionResult {
  json: string;
  error?: string;
}
