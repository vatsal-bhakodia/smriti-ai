import * as pdfjsLib from "pdfjs-dist";

// Disable worker in serverless environment
pdfjsLib.GlobalWorkerOptions.workerSrc = "";

/**
 * Extracts text from a PDF buffer using pdfjs-dist directly.
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,
      standardFontDataUrl: undefined,
      disableFontFace: true,
    });

    const pdf = await loadingTask.promise;
    const textPages: string[] = [];

    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      let lastY: number | undefined;
      let text = "";

      for (const item of textContent.items as any[]) {
        if (lastY === item.transform[5] || !lastY) {
          text += item.str;
        } else {
          text += "\n" + item.str;
        }
        lastY = item.transform[5];
      }

      textPages.push(text);
    }

    return textPages.join("\n\n");
  } catch (error) {
    console.error("PDF text extraction error:", error);
    throw new Error(
      `Failed to extract text from PDF: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
