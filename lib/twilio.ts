// lib/twilio.ts
import { Twilio } from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// For development, we'll create a mock client if credentials are missing
let twilioClient: Twilio;

if (accountSid && authToken) {
  twilioClient = new Twilio(accountSid, authToken);
} else {
  // Mock Twilio client for development/testing when credentials are missing
  twilioClient = {
    messages: {
      create: async (options: any) => {
        console.log('[MOCK TWILIO] Would send message:', {
          to: options.to,
          from: options.from,
          body: options.body,
          mediaUrl: options.mediaUrl
        });
        return {
          sid: 'mock_message_sid',
          status: 'queued',
          to: options.to,
          from: options.from
        };
      }
    }
  } as any;
}

export { twilioClient };
