import type { ConversionOptions, ConversionResult } from "../types";

export function convertXmlToJson(
  xmlString: string,
  options: ConversionOptions,
): ConversionResult {
  try {
    const trimmed = xmlString.trim();
    if (!trimmed) {
      return { json: "", error: "Empty input" };
    }

    const parser = new XmlParser(trimmed);
    const root = parser.parse();
    const json = JSON.stringify(
      { [root.tag]: nodeToObject(root) },
      null,
      options.indent,
    );

    return { json };
  } catch (e) {
    if (e instanceof XmlParseError) {
      return { json: "", error: e.message };
    }
    return { json: "", error: String(e) };
  }
}

// --- Simple XML Parser ---

interface XmlNode {
  tag: string;
  attributes: Record<string, string>;
  children: XmlNode[];
  text: string;
}

class XmlParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "XmlParseError";
  }
}

class XmlParser {
  private pos = 0;
  private readonly input: string;

  constructor(input: string) {
    this.input = input;
  }

  parse(): XmlNode {
    this.skipProlog();
    const node = this.parseElement();
    return node;
  }

  private skipProlog() {
    this.skipWhitespace();
    // Skip XML declaration <?xml ... ?>
    while (this.input.startsWith("<?", this.pos)) {
      const end = this.input.indexOf("?>", this.pos);
      if (end === -1) throw new XmlParseError("Unterminated processing instruction");
      this.pos = end + 2;
      this.skipWhitespace();
    }
    // Skip comments <!-- ... -->
    while (this.input.startsWith("<!--", this.pos)) {
      const end = this.input.indexOf("-->", this.pos);
      if (end === -1) throw new XmlParseError("Unterminated comment");
      this.pos = end + 3;
      this.skipWhitespace();
    }
  }

  private parseElement(): XmlNode {
    this.skipWhitespace();
    this.expect("<");

    const tag = this.readTagName();
    if (!tag) throw new XmlParseError("Expected tag name");

    const attributes = this.parseAttributes();

    this.skipWhitespace();

    // Self-closing tag
    if (this.input.startsWith("/>", this.pos)) {
      this.pos += 2;
      return { tag, attributes, children: [], text: "" };
    }

    this.expect(">");

    // Parse children and text
    const children: XmlNode[] = [];
    let text = "";

    while (this.pos < this.input.length) {
      this.skipComments();

      // Closing tag
      if (this.input.startsWith(`</${tag}`, this.pos)) {
        this.pos += 2 + tag.length;
        this.skipWhitespace();
        this.expect(">");
        return { tag, attributes, children, text: text.trim() };
      }

      // Child element
      if (this.input[this.pos] === "<" && this.input[this.pos + 1] !== "/") {
        children.push(this.parseElement());
        continue;
      }

      // CDATA section
      if (this.input.startsWith("<![CDATA[", this.pos)) {
        const cdataEnd = this.input.indexOf("]]>", this.pos);
        if (cdataEnd === -1) throw new XmlParseError("Unterminated CDATA section");
        text += this.input.slice(this.pos + 9, cdataEnd);
        this.pos = cdataEnd + 3;
        continue;
      }

      // Closing tag for a different element means malformed XML
      if (this.input.startsWith("</", this.pos)) {
        throw new XmlParseError(
          `Expected closing tag </${tag}> but found ${this.input.slice(this.pos, this.pos + 20)}`,
        );
      }

      // Text content
      const nextTag = this.input.indexOf("<", this.pos);
      if (nextTag === -1) {
        throw new XmlParseError(`Unterminated element <${tag}>`);
      }
      text += this.input.slice(this.pos, nextTag);
      this.pos = nextTag;
    }

    throw new XmlParseError(`Unterminated element <${tag}>`);
  }

  private parseAttributes(): Record<string, string> {
    const attrs: Record<string, string> = {};

    while (this.pos < this.input.length) {
      this.skipWhitespace();
      if (
        this.input[this.pos] === ">" ||
        this.input[this.pos] === "/" ||
        this.pos >= this.input.length
      ) {
        break;
      }

      const name = this.readAttrName();
      if (!name) break;

      this.skipWhitespace();
      this.expect("=");
      this.skipWhitespace();

      const quote = this.input[this.pos];
      if (quote !== '"' && quote !== "'") {
        throw new XmlParseError(`Expected quote for attribute ${name}`);
      }
      this.pos++;

      const valueEnd = this.input.indexOf(quote, this.pos);
      if (valueEnd === -1) {
        throw new XmlParseError(`Unterminated attribute value for ${name}`);
      }

      attrs[name] = this.unescapeXml(this.input.slice(this.pos, valueEnd));
      this.pos = valueEnd + 1;
    }

    return attrs;
  }

  private readTagName(): string {
    const start = this.pos;
    while (
      this.pos < this.input.length &&
      /[a-zA-Z0-9_:.-]/.test(this.input[this.pos]!)
    ) {
      this.pos++;
    }
    return this.input.slice(start, this.pos);
  }

  private readAttrName(): string {
    const start = this.pos;
    while (
      this.pos < this.input.length &&
      /[a-zA-Z0-9_:.-]/.test(this.input[this.pos]!)
    ) {
      this.pos++;
    }
    return this.input.slice(start, this.pos);
  }

  private skipWhitespace() {
    while (this.pos < this.input.length && /\s/.test(this.input[this.pos]!)) {
      this.pos++;
    }
  }

  private skipComments() {
    while (this.input.startsWith("<!--", this.pos)) {
      const end = this.input.indexOf("-->", this.pos);
      if (end === -1) throw new XmlParseError("Unterminated comment");
      this.pos = end + 3;
      this.skipWhitespace();
    }
  }

  private expect(str: string) {
    if (!this.input.startsWith(str, this.pos)) {
      throw new XmlParseError(
        `Expected "${str}" at position ${this.pos}, found "${this.input.slice(this.pos, this.pos + 10)}"`,
      );
    }
    this.pos += str.length;
  }

  private unescapeXml(str: string): string {
    return str
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");
  }
}

// --- Node to JSON Object ---

function nodeToObject(
  node: XmlNode,
): Record<string, unknown> | string | null {
  const obj: Record<string, unknown> = {};

  // Attributes
  for (const [name, value] of Object.entries(node.attributes)) {
    obj[`@${name}`] = value;
  }

  const hasAttributes = Object.keys(node.attributes).length > 0;
  const hasChildren = node.children.length > 0;
  const hasText = node.text.length > 0;

  // Text-only element with no attributes
  if (!hasChildren && !hasAttributes) {
    return node.text || null;
  }

  // Mixed content: text + children or text + attributes
  if (hasText) {
    obj["#text"] = node.text;
  }

  // Group child elements by tag name
  const grouped = new Map<string, XmlNode[]>();
  for (const child of node.children) {
    if (!grouped.has(child.tag)) {
      grouped.set(child.tag, []);
    }
    grouped.get(child.tag)!.push(child);
  }

  for (const [tag, elements] of grouped) {
    if (elements.length === 1) {
      obj[tag] = nodeToObject(elements[0]!);
    } else {
      obj[tag] = elements.map((el) => nodeToObject(el));
    }
  }

  return obj;
}
