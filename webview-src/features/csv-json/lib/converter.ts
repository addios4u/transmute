export type Delimiter = "," | "\t" | ";";

export interface CsvJsonResult {
  output: string;
  error: string | null;
}

function parseCsvLine(line: string, delimiter: Delimiter): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }

  result.push(current);
  return result;
}

export function csvToJson(csv: string, delimiter: Delimiter): CsvJsonResult {
  try {
    const lines = csv.split(/\r?\n/).filter((line) => line.trim() !== "");
    if (lines.length === 0) {
      return { output: "[]", error: null };
    }

    const headers = parseCsvLine(lines[0]!, delimiter);
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]!, delimiter);
      const obj: Record<string, string> = {};
      headers.forEach((header, j) => {
        obj[header.trim()] = values[j]?.trim() ?? "";
      });
      result.push(obj);
    }

    return { output: JSON.stringify(result, null, 2), error: null };
  } catch (e) {
    return {
      output: "",
      error: e instanceof Error ? e.message : "Failed to parse CSV",
    };
  }
}

function escapeCsvField(field: string, delimiter: Delimiter): string {
  const needsQuoting =
    field.includes(delimiter) ||
    field.includes('"') ||
    field.includes("\n") ||
    field.includes("\r");
  if (needsQuoting) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

export function jsonToCsv(json: string, delimiter: Delimiter): CsvJsonResult {
  try {
    const parsed = JSON.parse(json);

    if (!Array.isArray(parsed)) {
      return { output: "", error: "json_not_array" };
    }

    if (parsed.length === 0) {
      return { output: "", error: null };
    }

    const headers = Object.keys(parsed[0]);
    const headerLine = headers
      .map((h) => escapeCsvField(h, delimiter))
      .join(delimiter);

    const dataLines = parsed.map((item: Record<string, unknown>) =>
      headers
        .map((header) => escapeCsvField(String(item[header] ?? ""), delimiter))
        .join(delimiter),
    );

    return { output: [headerLine, ...dataLines].join("\n"), error: null };
  } catch {
    return { output: "", error: "invalid_json" };
  }
}
