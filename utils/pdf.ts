/**
 * Robust PDF text extraction using Python-based parser
 *    console.log('🐍 Running Python PDF parser:', scriptPath);
    console.log('🔗 PDF URL:', pdfUrl);@param pdfUrl - The URL of the PDF file (typically from Cloudinary)
 * @returns Promise<string> - The extracted text content
 */
export async function extractPDFText(pdfUrl: string): Promise<string> {
  try {
    console.log('🔍 Starting Python-based PDF text extraction for:', pdfUrl);
    
    // Use Python script for robust PDF parsing
    const extractedText = await extractWithPythonParser(pdfUrl);
    
    if (extractedText && extractedText.length > 10) {
      console.log('✅ Successfully extracted', extractedText.length, 'characters');
      console.log('📝 Preview:', extractedText.substring(0, 100) + '...');
      return extractedText;
    } else {
      console.log('⚠️ No readable text found, trying fallback extraction');
      return await fallbackExtraction(pdfUrl);
    }
    
  } catch (error) {
    console.error('❌ PDF extraction failed:', error);
    console.log('🔄 Trying fallback extraction...');
    return await fallbackExtraction(pdfUrl);
  }
}

/**
 * Fallback extraction when Python parser fails
 */
async function fallbackExtraction(pdfUrl: string): Promise<string> {
  try {
    // Download the PDF file
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Try basic text extraction
    const extractedText = await extractTextFromPDFBuffer(buffer);
    
    if (extractedText && extractedText.length > 10) {
      return extractedText;
    } else {
      return createDocumentSummary(buffer, pdfUrl);
    }
  } catch (error) {
    return createErrorFallback(pdfUrl, error);
  }
}

/**
 * Extract PDF text using Python parser
 */
async function extractWithPythonParser(pdfUrl: string): Promise<string> {
  const { spawn } = require('child_process');
  const path = require('path');
  
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), 'scripts', 'pdf_parser.py');
    console.log('� Running Python PDF parser:', scriptPath);
    
    const pythonProcess = spawn('python', [scriptPath, pdfUrl], {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let stdout = '';
    let stderr = '';
    
    pythonProcess.stdout.on('data', (data: any) => {
      stdout += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data: any) => {
      stderr += data.toString();
    });
    
    pythonProcess.on('close', (code: any) => {
      console.log('🐍 Python process finished with code:', code);
      console.log('📤 stdout length:', stdout.length);
      console.log('📤 stderr length:', stderr.length);
      if (stdout.length > 0) console.log('📤 stdout preview:', stdout.substring(0, 100));
      if (stderr.length > 0) console.log('📤 stderr preview:', stderr.substring(0, 100));
      
      if (code === 0) {
        try {
          const result = JSON.parse(stdout);
          if (result.success) {
            console.log('✅ Python parser succeeded, extracted', result.length, 'characters');
            resolve(result.text);
          } else {
            console.error('❌ Python parser failed:', result.error);
            reject(new Error(result.error));
          }
        } catch (parseError) {
          console.error('❌ Failed to parse Python output:', parseError);
          console.log('Raw stdout:', stdout);
          reject(new Error('Failed to parse Python output'));
        }
      } else {
        console.error('❌ Python process failed with code:', code);
        if (stderr.trim()) {
          console.error('❌ stderr:', stderr);
        }
        reject(new Error(`Python process failed with exit code ${code}`));
      }
    });
    
    pythonProcess.on('error', (error: any) => {
      console.error('❌ Failed to start Python process:', error);
      reject(error);
    });
  });
}

/**
 * Extract text from PDF buffer using multiple robust methods
 */
async function extractTextFromPDFBuffer(buffer: Buffer): Promise<string> {
  try {
    const pdfString = buffer.toString('latin1');
    
    // Check if it's a valid PDF
    if (!pdfString.startsWith('%PDF-')) {
      throw new Error('Not a valid PDF file');
    }
    
    console.log('📋 Analyzing PDF structure...');
    
    // Method 1: Extract from text objects (BT...ET blocks)
    const textObjects = extractTextObjects(pdfString);
    if (textObjects.length > 50) {
      console.log('✅ Found text in PDF text objects');
      return cleanExtractedText(textObjects);
    }
    
    // Method 2: Look for text in parentheses with better decoding
    const textInParens = extractTextFromParenthesesAdvanced(pdfString);
    if (textInParens.length > 50) {
      console.log('✅ Found text in parentheses');
      return cleanExtractedText(textInParens);
    }
    
    // Method 3: Extract from content streams
    const streamText = extractFromContentStreams(pdfString);
    if (streamText.length > 50) {
      console.log('✅ Found text in content streams');
      return cleanExtractedText(streamText);
    }
    
    // Method 4: Raw text extraction with encoding fixes
    const rawText = extractRawTextWithEncoding(buffer);
    if (rawText.length > 50) {
      console.log('✅ Found raw text with encoding fixes');
      return cleanExtractedText(rawText);
    }
    
    // Method 5: Unicode text extraction
    const unicodeText = extractUnicodeText(buffer);
    if (unicodeText.length > 50) {
      console.log('✅ Found Unicode text');
      return cleanExtractedText(unicodeText);
    }
    
    console.log('⚠️ No readable text found in PDF');
    return '';
    
  } catch (error) {
    console.error('Error parsing PDF buffer:', error);
    return '';
  }
}

/**
 * Extract text from PDF text objects (BT...ET blocks) - most reliable method
 */
function extractTextObjects(pdfString: string): string {
  const textPieces: string[] = [];
  
  // Look for text objects between BT (Begin Text) and ET (End Text)
  const textObjectRegex = /BT\s+([\s\S]*?)\s+ET/g;
  let match;
  
  while ((match = textObjectRegex.exec(pdfString)) !== null) {
    const textBlock = match[1];
    
    // Extract Tj (show text) operations
    const tjRegex = /\(([^)]*)\)\s*Tj/g;
    let tjMatch;
    
    while ((tjMatch = tjRegex.exec(textBlock)) !== null) {
      const text = decodePDFString(tjMatch[1]);
      if (text && text.length > 0) {
        textPieces.push(text);
      }
    }
    
    // Extract TJ (show text with positioning) operations
    const tjArrayRegex = /\[\s*(.*?)\s*\]\s*TJ/g;
    let tjArrayMatch;
    
    while ((tjArrayMatch = tjArrayRegex.exec(textBlock)) !== null) {
      const arrayContent = tjArrayMatch[1];
      
      // Extract strings from the array, ignoring numbers
      const stringMatches = arrayContent.match(/\(([^)]*)\)/g);
      if (stringMatches) {
        for (const stringMatch of stringMatches) {
          const text = decodePDFString(stringMatch.slice(1, -1));
          if (text && text.length > 0) {
            textPieces.push(text);
          }
        }
      }
    }
  }
  
  return textPieces.join(' ');
}

/**
 * Advanced parentheses text extraction with better decoding
 */
function extractTextFromParenthesesAdvanced(pdfString: string): string {
  const textPieces: string[] = [];
  const regex = /\(([^)]+)\)/g;
  let match;
  
  while ((match = regex.exec(pdfString)) !== null) {
    const text = match[1];
    
    // Skip if too short or no letters
    if (text.length < 2 || !/[a-zA-Z]/.test(text)) continue;
    
    // Decode with advanced PDF string handling
    const decoded = decodePDFString(text);
    
    // Quality check - must have reasonable text characteristics
    if (decoded && decoded.length > 2 && isReadableText(decoded)) {
      textPieces.push(decoded);
    }
  }
  
  return textPieces.join(' ');
}

/**
 * Extract text from content streams with decompression awareness
 */
function extractFromContentStreams(pdfString: string): string {
  const textPieces: string[] = [];
  
  // Find all stream objects
  const streamRegex = /(\d+)\s+\d+\s+obj\s*[\s\S]*?stream\s*([\s\S]*?)\s*endstream/g;
  let match;
  
  while ((match = streamRegex.exec(pdfString)) !== null) {
    const streamContent = match[2];
    
    // Check if stream contains text operators
    if (streamContent.includes('Tj') || streamContent.includes('TJ') || streamContent.includes('BT')) {
      // Try to extract text from this stream
      const streamText = extractTextObjects(streamContent);
      if (streamText.length > 0) {
        textPieces.push(streamText);
      }
      
      // Also try parentheses extraction
      const parenText = extractTextFromParenthesesAdvanced(streamContent);
      if (parenText.length > 0) {
        textPieces.push(parenText);
      }
    }
  }
  
  return textPieces.join(' ');
}

/**
 * Extract raw text with different encoding attempts
 */
function extractRawTextWithEncoding(buffer: Buffer): string {
  const textPieces: string[] = [];
  
  // Try different encodings
  const encodings = ['utf8', 'latin1', 'ascii', 'utf16le', 'ucs2'];
  
  for (const encoding of encodings) {
    try {
      const text = buffer.toString(encoding as BufferEncoding);
      const readable = extractReadableSequences(text);
      
      if (readable.length > 50) {
        textPieces.push(readable);
        break; // Stop at first successful encoding
      }
    } catch (error) {
      continue;
    }
  }
  
  return textPieces.join(' ');
}

/**
 * Extract Unicode text from buffer
 */
function extractUnicodeText(buffer: Buffer): string {
  const textPieces: string[] = [];
  
  // Look for UTF-8 BOM and Unicode sequences
  if (buffer.includes(Buffer.from([0xEF, 0xBB, 0xBF]))) {
    // UTF-8 BOM found
    const utf8Text = buffer.toString('utf8');
    const readable = extractReadableSequences(utf8Text);
    if (readable.length > 0) {
      textPieces.push(readable);
    }
  }
  
  // Look for UTF-16 patterns
  if (buffer.includes(Buffer.from([0xFF, 0xFE])) || buffer.includes(Buffer.from([0xFE, 0xFF]))) {
    try {
      const utf16Text = buffer.toString('utf16le');
      const readable = extractReadableSequences(utf16Text);
      if (readable.length > 0) {
        textPieces.push(readable);
      }
    } catch (error) {
      // UTF-16 decoding failed
    }
  }
  
  return textPieces.join(' ');
}

/**
 * Advanced PDF string decoder with proper escape handling
 */
function decodePDFString(text: string): string {
  try {
    let decoded = text
      // Basic escape sequences
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\b/g, '\b')
      .replace(/\\f/g, '\f')
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')')
      .replace(/\\\\/g, '\\')
      
      // Octal escape sequences (\nnn)
      .replace(/\\([0-7]{1,3})/g, (match, octal) => {
        const charCode = parseInt(octal, 8);
        return charCode > 0 && charCode < 256 ? String.fromCharCode(charCode) : match;
      })
      
      // Hexadecimal escape sequences (\xHH)
      .replace(/\\x([0-9A-Fa-f]{2})/g, (match, hex) => {
        const charCode = parseInt(hex, 16);
        return String.fromCharCode(charCode);
      });
    
    // Clean up any remaining artifacts
    decoded = decoded
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ') // Remove control chars
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    return decoded;
    
  } catch (error) {
    return text; // Return original if decoding fails
  }
}

/**
 * Check if text is readable (not gibberish)
 */
function isReadableText(text: string): boolean {
  if (text.length < 3) return false;
  
  // Check for reasonable alphabetic content
  const alphaRatio = (text.match(/[a-zA-Z]/g) || []).length / text.length;
  
  // Check for common words or patterns
  const hasWords = /\b[a-zA-Z]{2,}\b/.test(text);
  
  // Check for excessive special characters
  const specialRatio = (text.match(/[^\w\s.,!?;:()\-'"]/g) || []).length / text.length;
  
  return alphaRatio > 0.3 && hasWords && specialRatio < 0.5;
}

/**
 * Extract readable sequences from any text
 */
function extractReadableSequences(text: string): string {
  const readableChunks: string[] = [];
  
  // Split by common delimiters and filter readable parts
  const chunks = text.split(/[\x00-\x1F\x7F-\xFF]+/);
  
  for (const chunk of chunks) {
    if (chunk.length > 5 && isReadableText(chunk)) {
      readableChunks.push(chunk.trim());
    }
  }
  
  // Also try to find readable patterns in the full text
  const wordPattern = /[a-zA-Z][a-zA-Z\s.,!?;:'"()\-]{10,}/g;
  const wordMatches = text.match(wordPattern);
  
  if (wordMatches) {
    for (const match of wordMatches) {
      if (isReadableText(match)) {
        readableChunks.push(match.trim());
      }
    }
  }
  
  return [...new Set(readableChunks)].join(' ');
}

/**
 * Extract text that appears in parentheses in PDF
 */
function extractTextFromParentheses(pdfString: string): string {
  const textPieces: string[] = [];
  const regex = /\(([^)]+)\)/g;
  let match;
  
  while ((match = regex.exec(pdfString)) !== null) {
    const text = match[1];
    // Only include if it looks like readable text
    if (text.length > 2 && /[a-zA-Z]/.test(text)) {
      // Decode PDF escape sequences
      const decoded = text
        .replace(/\\n/g, ' ')
        .replace(/\\r/g, ' ')
        .replace(/\\t/g, ' ')
        .replace(/\\\(/g, '(')
        .replace(/\\\)/g, ')')
        .replace(/\\\\/g, '\\');
      
      textPieces.push(decoded);
    }
  }
  
  return textPieces.join(' ');
}

/**
 * Extract readable ASCII text from buffer
 */
function extractReadableASCII(buffer: Buffer): string {
  const textPieces: string[] = [];
  let currentText = '';
  
  for (let i = 0; i < buffer.length; i++) {
    const byte = buffer[i];
    
    // Check if byte is printable ASCII (32-126)
    if (byte >= 32 && byte <= 126) {
      currentText += String.fromCharCode(byte);
    } else if (byte === 10 || byte === 13) {
      // Newline or carriage return
      currentText += ' ';
    } else {
      // End of readable sequence
      if (currentText.length > 3 && /[a-zA-Z]{2,}/.test(currentText)) {
        textPieces.push(currentText.trim());
      }
      currentText = '';
    }
  }
  
  // Don't forget the last text if buffer ends with readable content
  if (currentText.length > 3 && /[a-zA-Z]{2,}/.test(currentText)) {
    textPieces.push(currentText.trim());
  }
  
  // Filter and join meaningful text pieces
  const meaningfulText = textPieces
    .filter(text => text.length > 3)
    .filter(text => !/^[^a-zA-Z]*$/.test(text)) // Remove non-alphabetic strings
    .join(' ');
  
  return meaningfulText;
}

/**
 * Extract text from PDF stream objects
 */
function extractFromStreams(pdfString: string): string {
  const textPieces: string[] = [];
  const streamRegex = /stream\s*([\s\S]*?)\s*endstream/g;
  let match;
  
  while ((match = streamRegex.exec(pdfString)) !== null) {
    const streamContent = match[1];
    
    // Look for text operators in the stream
    if (streamContent.includes('Tj') || streamContent.includes('TJ')) {
      const streamText = extractTextFromParentheses(streamContent);
      if (streamText.length > 0) {
        textPieces.push(streamText);
      }
    }
  }
  
  return textPieces.join(' ');
}

/**
 * Clean and format extracted text
 */
function cleanExtractedText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Multiple spaces to single
    .replace(/[^\x20-\x7E\s]/g, ' ') // Replace non-printable with space
    .trim()
    .substring(0, 10000); // Limit length
}

/**
 * Create a document summary when text extraction fails
 */
function createDocumentSummary(buffer: Buffer, pdfUrl: string): string {
  const sizeKB = Math.round(buffer.length / 1024);
  const fileName = pdfUrl.split('/').pop()?.split('.')[0] || 'document';
  
  // Try to extract basic metadata
  const pdfString = buffer.toString('latin1');
  const title = extractMetadata(pdfString, 'Title');
  const author = extractMetadata(pdfString, 'Author');
  const pages = countPages(pdfString);
  
  return `PDF Document Analysis:

File: ${fileName}
Size: ${sizeKB} KB
Pages: ${pages}
${title ? `Title: ${title}` : ''}
${author ? `Author: ${author}` : ''}

This PDF document contains ${pages} page${pages !== 1 ? 's' : ''} of content. The file appears to use advanced PDF formatting or compression that prevents direct text extraction. Based on the file structure, this document likely contains meaningful text content, images, or formatted layouts that would benefit from specialized PDF processing tools for complete text extraction.

For AI analysis purposes, this should be treated as a ${pages}-page PDF document${title ? ` titled "${title}"` : ''} containing structured information relevant to its subject matter.`;
}

/**
 * Extract metadata from PDF
 */
function extractMetadata(pdfString: string, field: string): string | null {
  const regex = new RegExp(`\\/${field}\\s*\\(([^)]*)\\)`, 'i');
  const match = pdfString.match(regex);
  return match ? match[1].replace(/\\[()]/g, '') : null;
}

/**
 * Count pages in PDF
 */
function countPages(pdfString: string): number {
  const pageMatches = pdfString.match(/\/Type\s*\/Page[^s]/g);
  return pageMatches ? pageMatches.length : 1;
}

/**
 * Create error fallback message
 */
function createErrorFallback(pdfUrl: string, error: any): string {
  const fileName = pdfUrl.split('/').pop() || 'document.pdf';
  
  return `PDF Processing Notice:

File: ${fileName}
Status: Processing Error

Unable to extract text content from this PDF file due to: ${error?.message || 'Unknown error'}

This PDF may contain:
- Scanned images requiring OCR
- Advanced compression or encryption
- Complex formatting or layouts
- Protected or restricted content

For AI analysis, please consider this as a PDF document that requires specialized processing or manual review to extract its textual content.`;
}

/**
 * Clean PDF text for AI processing (simplified version)
 */
export function cleanPDFText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .replace(/[^\x20-\x7E\n]/g, ' ')
    .trim()
    .substring(0, 50000);
}
