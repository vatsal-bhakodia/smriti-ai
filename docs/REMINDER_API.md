# 📱 WhatsApp Reminder API Documentation

## Overview
The enhanced WhatsApp reminder API (`/api/reminder-message`) is designed to send motivational messages to inactive users via WhatsApp. This endpoint is optimized for Vercel Cron Jobs and includes comprehensive error handling and testing capabilities.

## ✨ Features

### 🎯 Smart User Filtering
- **Inactive User Detection**: Only sends messages to users who haven't logged in for a specified number of days (default: 3 days)
- **Mobile Validation**: Filters out users without valid mobile numbers
- **Database Optimization**: Uses efficient Prisma queries with proper indexing

### 🛡️ Error Handling & Logging
- **Comprehensive Logging**: Detailed console logs for monitoring and debugging
- **Error Tracking**: Captures and reports individual message failures
- **Performance Metrics**: Tracks execution time and success rates
- **Graceful Failures**: Continues processing even if individual messages fail

### 🧪 Testing Support
- **Dry Run Mode**: Test the logic without sending actual messages
- **Configurable Parameters**: Adjust inactivity threshold for testing
- **Detailed Response**: Returns comprehensive statistics about the operation

## 🚀 API Endpoints

### GET `/api/reminder-message`

**Query Parameters:**
- `dryRun` (optional): Set to `'true'` to simulate without sending messages
- `inactiveDays` (optional): Number of days to consider a user inactive (default: 3)

**Examples:**
```bash
# Send messages to users inactive for 3+ days
GET /api/reminder-message

# Test run without sending messages
GET /api/reminder-message?dryRun=true

# Send to users inactive for 7+ days
GET /api/reminder-message?inactiveDays=7

# Test with custom inactivity threshold
GET /api/reminder-message?dryRun=true&inactiveDays=1
```

## 📊 Response Format

```typescript
interface ReminderResult {
  totalInactiveUsers: number;    // Total inactive users found
  messagesSent: number;          // Successfully sent messages
  errors: Array<{               // Failed message attempts
    mobile: string;
    error: string;
  }>;
  dryRun: boolean;              // Whether this was a test run
}
```

**Success Response Example:**
```json
{
  "totalInactiveUsers": 25,
  "messagesSent": 23,
  "errors": [
    {
      "mobile": "+1234567890",
      "error": "Invalid phone number format"
    },
    {
      "mobile": "+9876543210", 
      "error": "Twilio delivery failed"
    }
  ],
  "dryRun": false
}
```

**Error Response Example:**
```json
{
  "error": "TWILIO_PHONE_NUMBER environment variable is required"
}
```

## 🎨 Message Content

### 📸 Memes
The API randomly selects from a curated collection of motivational memes stored on Cloudinary.

### 💬 Text Messages
Motivational messages in Hindi/English mix:
- "Padhai kar lo thoda ⏰"
- "Aur bhai kesi chal rahi hai revision😼"
- "Revision naam ki bhi kuch chiz hoti hai janab 🐸"
- "Lijiye jal pijiye 🍸 aur revision kijiye"
- "Your learning journey is waiting! Come back to Smriti AI 📚✨"
- "Don't let your streak break! Time for some quick revision 🔥"
- "Knowledge is power, but revision is superpower! 💪📖"

## 🔧 Environment Variables Required

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=whatsapp:+1234567890

# Database
DATABASE_URL=your_postgres_connection_string
DIRECT_URL=your_direct_postgres_connection_string
```

## ⏰ Vercel Cron Job Setup

The API is designed to work with Vercel Cron Jobs. The project maintainer will configure the cron job via Vercel dashboard.

**Recommended Schedule:**
- **Daily Reminders**: `0 9 * * *` (9 AM UTC daily)
- **Weekly Reminders**: `0 9 * * 1` (9 AM UTC every Monday)

**Example Cron Configuration:**
```json
{
  "crons": [
    {
      "path": "/api/reminder-message",
      "schedule": "0 9 * * *"
    }
  ]
}
```

## 🧪 Testing Guide

### 1. Dry Run Testing
```bash
# Test the logic without sending messages
curl "https://your-domain.com/api/reminder-message?dryRun=true"
```

### 2. Local Development Testing
```bash
# Install dependencies
npm install

# Set up environment variables in .env.local
# Run development server
npm run dev

# Test locally
curl "http://localhost:3000/api/reminder-message?dryRun=true&inactiveDays=1"
```

### 3. Monitoring Logs
Check Vercel Function logs or console output for:
- `[REMINDER-API]` prefixed logs
- User count and success/failure rates
- Individual message delivery status

## 📈 Performance Considerations

- **Rate Limiting**: 500ms delay between messages to avoid Twilio rate limits
- **Database Optimization**: Efficient queries with proper field selection
- **Memory Usage**: Processes users in chunks to handle large user bases
- **Timeout Handling**: Designed to complete within Vercel's function timeout limits

## 🔮 Future Enhancements

### Opt-out Support
```typescript
// Future schema addition
model User {
  // ... existing fields
  reminderOptOut Boolean @default(false)
}
```

### Message Personalization
- Include user's name in messages
- Reference their last accessed topic
- Adaptive message frequency based on engagement

### Analytics & Reporting
- Track message delivery rates
- Monitor user re-engagement after reminders
- A/B test different message content

## 🚨 Troubleshooting

### Common Issues

1. **"TWILIO_PHONE_NUMBER environment variable is required"**
   - Ensure all Twilio environment variables are set
   - Verify the phone number format includes `whatsapp:` prefix

2. **"Invalid phone number format"**
   - Check user mobile numbers in database
   - Ensure numbers include country codes

3. **High error rates**
   - Monitor Twilio account balance and status
   - Check for rate limiting issues
   - Verify WhatsApp Business account setup

### Debug Mode
Add `console.log` statements to track:
- User query results
- Message content selection
- Twilio API responses

## 📞 Support

For issues related to:
- **Cron Job Setup**: Contact project maintainer
- **Twilio Configuration**: Check Twilio dashboard and documentation
- **Database Issues**: Verify Prisma schema and connection strings
- **Message Content**: Review and update the `memes` and `motivationalTexts` arrays
