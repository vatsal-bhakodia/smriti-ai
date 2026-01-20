// lib/twilio.ts
import { Twilio } from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  console.warn("Twilio credentials missing in env variables; Twilio client is disabled.");
}

export const twilioClient =
  accountSid && authToken
    ? new Twilio(accountSid, authToken)
    : ({
        messages: {
          async create() {
            throw new Error("Twilio credentials missing in env variables");
          },
        },
      } as unknown as Twilio);
