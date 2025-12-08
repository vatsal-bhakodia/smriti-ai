/**
 * PDF Text Extraction from Scratch
 * Parses PDF structure and extracts text content without external libraries
 */

import { inflateSync } from "zlib";

interface PDFObject {
  type: string;
  content: any;
  stream?: Buffer;
}

/**
 * Fetches a PDF from a URL and extracts its text content
 */
export async function fetchPdfText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch PDF: ${res.status}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return await extractTextFromPDF(buffer);
}

/**
 * Extracts text from a PDF buffer
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdf = new PDFParser(buffer);
    return pdf.extractText();
  } catch (error) {
    console.error("PDF text extraction error:", error);
    throw new Error(
      `Failed to extract text from PDF: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

class PDFParser {
  private buffer: Buffer;
  private objects: Map<string, PDFObject> = new Map();

  constructor(buffer: Buffer) {
    this.buffer = buffer;
  }

  extractText(): string {
    // Validate PDF header
    const header = this.buffer.slice(0, 8).toString("ascii");
    if (!header.startsWith("%PDF-")) {
      throw new Error("Invalid PDF file");
    }

    // Parse cross-reference table and objects
    this.parseXRef();

    // Extract text from content streams
    const textChunks: string[] = [];

    for (const [id, obj] of this.objects) {
      if (obj.stream) {
        const text = this.extractTextFromStream(obj.stream);
        if (text) textChunks.push(text);
      }
    }

    return textChunks.join("\n\n");
  }

  private parseXRef(): void {
    const content = this.buffer.toString("latin1");

    // Find all object definitions (simplified approach)
    const objRegex = /(\d+)\s+(\d+)\s+obj\s*([\s\S]*?)\s*endobj/g;
    let match;

    while ((match = objRegex.exec(content)) !== null) {
      const objNum = match[1];
      const objContent = match[3];

      // Check if object has a stream
      const streamMatch = objContent.match(/stream\s*\n([\s\S]*?)\nendstream/);

      if (streamMatch) {
        const streamData = streamMatch[1];
        const streamBuffer = Buffer.from(streamData, "latin1");

        this.objects.set(objNum, {
          type: "stream",
          content: objContent,
          stream: streamBuffer,
        });
      } else {
        this.objects.set(objNum, {
          type: "object",
          content: objContent,
        });
      }
    }
  }

  private extractTextFromStream(stream: Buffer): string {
    try {
      // Try to decompress if it's a FlateDecode stream
      let decompressed = stream;

      try {
        decompressed = this.inflate(stream);
      } catch {
        // If decompression fails, use raw stream
        decompressed = stream;
      }

      return this.parseContentStream(decompressed.toString("latin1"));
    } catch {
      return "";
    }
  }

  private parseContentStream(content: string): string {
    const textChunks: string[] = [];

    // Extract text between BT (Begin Text) and ET (End Text) operators
    const textBlockRegex = /BT\s*([\s\S]*?)\s*ET/g;
    let match;

    while ((match = textBlockRegex.exec(content)) !== null) {
      const textBlock = match[1];

      // Extract text from Tj, TJ, and ' operators
      // Tj: (text)Tj
      const tjRegex = /\(((?:[^()\\]|\\.)*?)\)\s*Tj/g;
      let tjMatch;
      while ((tjMatch = tjRegex.exec(textBlock)) !== null) {
        textChunks.push(this.decodeText(tjMatch[1]));
      }

      // TJ: [(text) number (text)]TJ
      const tjArrayRegex = /\[([\s\S]*?)\]\s*TJ/g;
      let tjArrayMatch;
      while ((tjArrayMatch = tjArrayRegex.exec(textBlock)) !== null) {
        const arrayContent = tjArrayMatch[1];
        const stringRegex = /\(((?:[^()\\]|\\.)*?)\)/g;
        let strMatch;
        while ((strMatch = stringRegex.exec(arrayContent)) !== null) {
          textChunks.push(this.decodeText(strMatch[1]));
        }
      }

      // ': (text)'
      const quoteRegex = /\(((?:[^()\\]|\\.)*?)\)\s*'/g;
      let quoteMatch;
      while ((quoteMatch = quoteRegex.exec(textBlock)) !== null) {
        textChunks.push(this.decodeText(quoteMatch[1]));
      }
    }

    return textChunks.join(" ");
  }

  private decodeText(text: string): string {
    // Handle escape sequences
    return text
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .replace(/\\b/g, "\b")
      .replace(/\\f/g, "\f")
      .replace(/\\\(/g, "(")
      .replace(/\\\)/g, ")")
      .replace(/\\\\/g, "\\")
      .replace(/\\(\d{3})/g, (_, octal) =>
        String.fromCharCode(parseInt(octal, 8))
      );
  }

  private inflate(data: Buffer): Buffer {
    // Simple zlib inflation for FlateDecode
    try {
      return inflateSync(data);
    } catch {
      return data;
    }
  }
}
