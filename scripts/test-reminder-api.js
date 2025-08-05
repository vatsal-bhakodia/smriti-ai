#!/usr/bin/env node

/**
 * Test script for the WhatsApp Reminder API
 * Usage: node scripts/test-reminder-api.js [options]
 */

import readline from 'readline';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function testReminderAPI() {
  console.log('🧪 WhatsApp Reminder API Test Script');
  console.log('=====================================\n');

  try {
    // Get test parameters
    const dryRun = await question('Run in dry mode? (y/n): ');
    const isDryRun = dryRun.toLowerCase() === 'y';
    
    const inactiveDaysInput = await question('Inactive days threshold (default: 1 for testing): ');
    const inactiveDays = inactiveDaysInput ? parseInt(inactiveDaysInput) : 1;

    // Construct URL
    const params = new URLSearchParams();
    if (isDryRun) params.set('dryRun', 'true');
    params.set('inactiveDays', inactiveDays.toString());
    
    const url = `${API_BASE_URL}/api/reminder-message?${params.toString()}`;
    
    console.log(`\n🚀 Testing API: ${url}`);
    console.log(`Mode: ${isDryRun ? 'DRY RUN' : 'LIVE'}`);
    console.log(`Inactive Days: ${inactiveDays}`);
    
    if (!isDryRun) {
      const confirm = await question('\n⚠️  This will send real WhatsApp messages. Continue? (y/n): ');
      if (confirm.toLowerCase() !== 'y') {
        console.log('❌ Test cancelled');
        process.exit(0);
      }
    }

    console.log('\n⏳ Sending request...\n');

    // Make API request
    const response = await fetch(url);
    const result = await response.json();

    // Display results
    console.log('📊 Results:');
    console.log('===========');
    
    if (response.ok) {
      console.log(`✅ Status: Success (${response.status})`);
      console.log(`👥 Total Inactive Users: ${result.totalInactiveUsers}`);
      console.log(`📤 Messages Sent: ${result.messagesSent}`);
      console.log(`❌ Errors: ${result.errors.length}`);
      console.log(`🧪 Dry Run: ${result.dryRun}`);
      
      if (result.errors.length > 0) {
        console.log('\n❌ Error Details:');
        result.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error.mobile}: ${error.error}`);
        });
      }
      
      if (result.messagesSent > 0) {
        console.log(`\n🎉 Successfully processed ${result.messagesSent} users!`);
      }
    } else {
      console.log(`❌ Status: Error (${response.status})`);
      console.log(`💬 Message: ${result.error || 'Unknown error'}`);
    }

  } catch (error) {
    console.error('\n🚨 Test failed:', error.message);
  } finally {
    rl.close();
  }
}

// Handle script arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
WhatsApp Reminder API Test Script

Usage: node scripts/test-reminder-api.js [options]

Options:
  --help, -h     Show this help message

Environment Variables:
  NEXT_PUBLIC_APP_URL    Base URL for the API (default: http://localhost:3000)

Examples:
  node scripts/test-reminder-api.js
  NEXT_PUBLIC_APP_URL=https://your-app.vercel.app node scripts/test-reminder-api.js
`);
  process.exit(0);
}

// Run the test
testReminderAPI().catch(console.error);
