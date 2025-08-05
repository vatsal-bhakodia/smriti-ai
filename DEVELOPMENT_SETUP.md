# 🚀 Local Development Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Environment Variables
```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local with your actual values
# For testing the reminder API, you can skip Twilio credentials
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Start Development Server
```bash
npm run dev
```

## 🧪 Testing the Reminder API

### Option 1: Using the Test Script
```bash
npm run test:reminder
# or
node scripts/test-reminder-api.js
```

### Option 2: Direct API Testing
```bash
# Test without sending messages (dry run)
curl "http://localhost:3000/api/reminder-message?dryRun=true&inactiveDays=1"

# If you want to test with minimal setup (no Twilio credentials needed for testing)
curl "http://localhost:3000/api/reminder-message?dryRun=true"
```

## 🔧 Environment Variables for Testing

### Minimum Required (Database only)
```env
DATABASE_URL="your_postgresql_connection_string"
DIRECT_URL="your_direct_postgresql_connection_string"
```

### For Full WhatsApp Testing
```env
# Add Twilio credentials
TWILIO_ACCOUNT_SID="your_twilio_account_sid"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_PHONE_NUMBER="whatsapp:+1234567890"
```

## 📝 Notes

- The API now supports **mock mode** - it will work without Twilio credentials for testing
- Use `dryRun=true` to test the logic without sending any messages
- The app runs in **Clerk keyless mode** for development - no auth setup needed initially
- All Twilio messages are logged to console for debugging

## 🐛 Troubleshooting

### "Module type" warnings
- Fixed by adding `"type": "module"` to package.json

### Missing Twilio credentials
- API now gracefully handles missing credentials in development
- Use dry run mode for testing: `?dryRun=true`

### Database connection issues
- Make sure PostgreSQL is running
- Check your DATABASE_URL format
- Run `npx prisma generate` after any schema changes
