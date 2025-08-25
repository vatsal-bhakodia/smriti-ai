declare module "pdf-parse/lib/pdf-parse.js" {
  interface PDFParseResult {
    text: string;
    info?: any;
    metadata?: any;
    version?: string;
    numpages?: number;
    numrender?: number;
    textContent?: any;
  }
  function pdf(dataBuffer: Buffer | Uint8Array, options?: any): Promise<PDFParseResult>;
  export default pdf;
}


