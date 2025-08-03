/**
 * Test script to verify PDF processing integration
 */

import { extractPDFText } from './utils/pdf.js';

async function testPDFProcessing() {
  console.log('🧪 Testing PDF processing integration...\n');
  
  // Test with a working PDF URL
  const testUrl = 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf';
  
  try {
    console.log('📄 Testing PDF extraction with:', testUrl);
    const result = await extractPDFText(testUrl);
    
    console.log('\n✅ Test Results:');
    console.log('- Length:', result.length, 'characters');
    console.log('- Preview:', result.substring(0, 200) + '...');
    
    if (result.length > 100) {
      console.log('\n🎉 PDF processing is working correctly!');
      console.log('The Python-based parser successfully extracted text content.');
    } else {
      console.log('\n⚠️ Text extraction seems limited. Check the fallback methods.');
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('🔄 The system should fall back to TypeScript extraction methods.');
  }
}

// Run the test
testPDFProcessing();
