#!/usr/bin/env python3
"""
Advanced PDF text extraction using multiple Python libraries
This script provides robust PDF text extraction capabilities
"""

import sys
import json
import requests
from io import BytesIO
import logging
import warnings

# Completely disable all logging when called from Node.js
if len(sys.argv) > 1:
    # Disable all logging completely
    logging.disable(logging.CRITICAL)
    # Suppress warnings from libraries
    warnings.filterwarnings("ignore")
    # Don't redirect stderr on Windows - just disable logging

logger = logging.getLogger(__name__)

def extract_pdf_text(pdf_url):
    """
    Extract text from PDF using multiple methods with fallback
    """
    try:
        # Download PDF (no logging in production)
        response = requests.get(pdf_url, timeout=30)
        response.raise_for_status()
        
        pdf_bytes = BytesIO(response.content)
        
        # Try multiple extraction methods
        text = None
        
        # Method 1: Try pdfplumber (most reliable)
        try:
            text = extract_with_pdfplumber(pdf_bytes)
            if text and len(text.strip()) > 50:
                return clean_text(text)
        except Exception as e:
            pass  # Silent fail in production
        
        # Method 2: Try PyPDF2
        try:
            pdf_bytes.seek(0)  # Reset stream position
            text = extract_with_pypdf2(pdf_bytes)
            if text and len(text.strip()) > 50:
                return clean_text(text)
        except Exception as e:
            pass  # Silent fail in production
        
        # Method 3: Try pymupdf (fitz)
        try:
            pdf_bytes.seek(0)  # Reset stream position
            text = extract_with_pymupdf(pdf_bytes)
            if text and len(text.strip()) > 50:
                return clean_text(text)
        except Exception as e:
            pass  # Silent fail in production
        
        # Method 4: Try pdfminer
        try:
            pdf_bytes.seek(0)  # Reset stream position
            text = extract_with_pdfminer(pdf_bytes)
            if text and len(text.strip()) > 50:
                return clean_text(text)
        except Exception as e:
            pass  # Silent fail in production
        
        # If all methods fail
        return create_fallback_summary(pdf_url, response.content)
        
    except Exception as e:
        return f"Error extracting PDF text: {str(e)}"

def extract_with_pdfplumber(pdf_bytes):
    """Extract text using pdfplumber (most reliable for complex layouts)"""
    import pdfplumber
    
    text_parts = []
    with pdfplumber.open(pdf_bytes) as pdf:
        for page_num, page in enumerate(pdf.pages, 1):
            # Try different extraction methods
            page_text = page.extract_text()
            if not page_text:
                # Try with different settings
                page_text = page.extract_text(layout=True)
            if not page_text:
                # Try extracting words and joining
                words = page.extract_words()
                page_text = ' '.join([word['text'] for word in words])
            
            if page_text:
                text_parts.append(page_text)
    
    return '\n\n'.join(text_parts)

def extract_with_pypdf2(pdf_bytes):
    """Extract text using PyPDF2"""
    import PyPDF2
    
    reader = PyPDF2.PdfReader(pdf_bytes)
    text_parts = []
    
    for page_num, page in enumerate(reader.pages, 1):
        page_text = page.extract_text()
        if page_text:
            text_parts.append(page_text)
    
    return '\n\n'.join(text_parts)

def extract_with_pymupdf(pdf_bytes):
    """Extract text using pymupdf (fitz)"""
    import fitz  # PyMuPDF
    
    doc = fitz.open(stream=pdf_bytes.read(), filetype="pdf")
    text_parts = []
    
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        page_text = page.get_text()
        if page_text:
            text_parts.append(page_text)
    
    doc.close()
    return '\n\n'.join(text_parts)

def extract_with_pdfminer(pdf_bytes):
    """Extract text using pdfminer"""
    from pdfminer.high_level import extract_text
    
    pdf_bytes.seek(0)
    text = extract_text(pdf_bytes)
    return text

def clean_text(text):
    """Clean and normalize extracted text"""
    if not text:
        return ""
    
    # Basic cleaning
    text = text.strip()
    
    # Remove excessive whitespace
    import re
    text = re.sub(r'\n\s*\n', '\n\n', text)  # Multiple newlines to double
    text = re.sub(r'[ \t]+', ' ', text)      # Multiple spaces to single
    
    # Remove control characters but keep newlines
    text = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', text)
    
    # Limit length for API processing
    if len(text) > 50000:
        text = text[:50000] + "... [Content truncated for processing]"
    
    return text

def create_fallback_summary(pdf_url, content_bytes):
    """Create a summary when text extraction fails"""
    filename = pdf_url.split('/')[-1]
    size_kb = len(content_bytes) / 1024
    
    return f"""PDF Document Analysis:

File: {filename}
Size: {size_kb:.1f} KB
Status: Text extraction failed

This PDF document could not be processed for direct text extraction. 
This may be due to:
- Scanned images requiring OCR
- Complex formatting or encryption
- Corrupted file structure
- Protected content

The document appears to be a valid PDF file that may contain meaningful content 
requiring specialized processing or manual review."""

def main():
    """Main function for command line usage"""
    if len(sys.argv) != 2:
        print("Usage: python pdf_parser.py <pdf_url>")
        sys.exit(1)
    
    pdf_url = sys.argv[1]
    
    try:
        extracted_text = extract_pdf_text(pdf_url)
        
        # Output as JSON for easy parsing by Node.js
        result = {
            "success": True,
            "text": extracted_text,
            "length": len(extracted_text)
        }
        
        # Ensure ASCII encoding to avoid Windows console issues
        print(json.dumps(result, ensure_ascii=True, indent=2))
        
    except Exception as e:
        result = {
            "success": False,
            "error": str(e),
            "text": f"Error processing PDF: {str(e)}"
        }
        print(json.dumps(result, ensure_ascii=True, indent=2))
        sys.exit(1)

if __name__ == "__main__":
    main()
