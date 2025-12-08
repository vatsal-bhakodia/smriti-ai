import * as pdfParse from "pdf-parse";

/**
 * Extracts text from a PDF buffer.
 * Compatible with Vercel Serverless (Node.js runtime).
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Custom page render to avoid canvas dependencies
    const options = {
      pagerender: function (pageData: any) {
        return pageData.getTextContent().then(function (textContent: any) {
          let lastY,
            text = "";
          for (const item of textContent.items) {
            if (lastY == item.transform[5] || !lastY) {
              text += item.str;
            } else {
              text += "\n" + item.str;
            }
            lastY = item.transform[5];
          }
          return text;
        });
      },
    };

    // Handle both CommonJS and ESM exports
    const pdf = (pdfParse as any).default || pdfParse;

    // pdf-parse returns a promise with .text, .numpages, etc.
    const data = await pdf(buffer, options);

    return data.text;
  } catch (error) {
    console.error("PDF text extraction error:", error);
    throw new Error(
      `Failed to extract text from PDF: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
