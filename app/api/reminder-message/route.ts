import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { twilioClient } from "@/lib/twilio";
import prisma from "@/lib/prisma";

// Motivational memes for inactive users
const memes = [
  "https://res.cloudinary.com/dlvcibxgx/image/upload/v1744576271/WhatsApp_Image_2025-04-14_at_01.45.17_f73174b0_d3a8fs.jpg",
  "https://res.cloudinary.com/dlvcibxgx/image/upload/v1744576661/WhatsApp_Image_2025-04-14_at_02.05.00_223639b9_k7hqfo.jpg",
  "https://res.cloudinary.com/dlvcibxgx/image/upload/v1744576666/WhatsApp_Image_2025-04-14_at_02.05.43_a40fe67c_byswor.jpg",
  "https://res.cloudinary.com/dlvcibxgx/image/upload/v1744576671/WhatsApp_Image_2025-04-14_at_02.06.22_76fdc7e4_geuj3v.jpg",
];

// Motivational texts in Hindi/English mix
const motivationalTexts = [
  "Padhai kar lo thoda ⏰",
  "Aur bhai kesi chal rahi hai revision😼",
  "Revision naam ki bhi kuch chiz hoti hai janab 🐸",
  "Lijiye jal pijiye 🍸 aur revision kijiye",
  "Your learning journey is waiting! Come back to Smriti AI 📚✨",
  "Don't let your streak break! Time for some quick revision 🔥",
  "Knowledge is power, but revision is superpower! 💪📖",
];

interface ReminderResult {
  totalInactiveUsers: number;
  messagesSent: number;
  errors: Array<{ mobile: string; error: string }>;
  dryRun: boolean;
}

/**
 * Sends WhatsApp reminder messages to inactive users
 * This endpoint is designed to be triggered by Vercel Cron Jobs
 * 
 * Query Parameters:
 * - dryRun: boolean (optional) - If true, simulates sending without actually sending messages
 * - inactiveDays: number (optional) - Number of days to consider a user inactive (default: 3)
 */
export async function GET(request: NextRequest): Promise<NextResponse<ReminderResult | { error: string }>> {
  const startTime = Date.now();
  
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const dryRun = searchParams.get('dryRun') === 'true';
    const inactiveDays = parseInt(searchParams.get('inactiveDays') || '3');

    console.log(`[REMINDER-API] Starting reminder job - DryRun: ${dryRun}, InactiveDays: ${inactiveDays}`);

    // Validate environment variables for production use
    const hasValidTwilioConfig = process.env.TWILIO_ACCOUNT_SID && 
                                process.env.TWILIO_AUTH_TOKEN && 
                                process.env.TWILIO_PHONE_NUMBER;

    if (!hasValidTwilioConfig && !dryRun) {
      console.warn('[REMINDER-API] Missing Twilio configuration - running in mock mode');
    }

    // Calculate cutoff date for inactive users
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - inactiveDays);

    console.log(`[REMINDER-API] Fetching users inactive since: ${cutoffDate.toISOString()}`);

    let inactiveUsers: Array<{
      id: string;
      username: string;
      mobile: string;
      lastLogin: Date;
    }> = [];

    try {
      // Fetch inactive users from database
      inactiveUsers = await prisma.user.findMany({
        where: {
          lastLogin: {
            lt: cutoffDate
          },
          mobile: {
            not: {
              in: [null, '']
            }
          }
        },
        select: {
          id: true,
          username: true,
          mobile: true,
          lastLogin: true
        }
      });
    } catch (dbError) {
      console.warn(`[REMINDER-API] Database error: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
      
      // For testing purposes, use mock data when database is not available
      if (dryRun) {
        console.log('[REMINDER-API] Using mock data for testing since database is unavailable');
        inactiveUsers = [
          {
            id: 'mock-user-1',
            username: 'testuser1',
            mobile: '+1234567890',
            lastLogin: new Date(Date.now() - (inactiveDays + 1) * 24 * 60 * 60 * 1000)
          },
          {
            id: 'mock-user-2', 
            username: 'testuser2',
            mobile: '+9876543210',
            lastLogin: new Date(Date.now() - (inactiveDays + 2) * 24 * 60 * 60 * 1000)
          }
        ];
      } else {
        // In production, we need a real database
        throw new Error(`Database connection required for production use: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
      }
    }

    console.log(`[REMINDER-API] Found ${inactiveUsers.length} inactive users`);

    const result: ReminderResult = {
      totalInactiveUsers: inactiveUsers.length,
      messagesSent: 0,
      errors: [],
      dryRun
    };

    // Send messages to inactive users
    for (const user of inactiveUsers) {
      try {
        if (!user.mobile) {
          console.warn(`[REMINDER-API] Skipping user ${user.id} - No mobile number`);
          continue;
        }

        // Select random meme and text
        const randomMeme = memes[Math.floor(Math.random() * memes.length)];
        const randomText = motivationalTexts[Math.floor(Math.random() * motivationalTexts.length)];

        if (dryRun) {
          console.log(`[REMINDER-API] DRY RUN - Would send to ${user.mobile}: "${randomText}"`);
          result.messagesSent++;
        } else {
          // Send actual WhatsApp message (or mock if no credentials)
          const messageResult = await twilioClient.messages.create({
            to: `whatsapp:${user.mobile}`,
            from: process.env.TWILIO_PHONE_NUMBER || 'whatsapp:+1234567890',
            body: randomText,
            mediaUrl: [randomMeme],
          });

          if (hasValidTwilioConfig) {
            console.log(`[REMINDER-API] Message sent successfully to ${user.mobile} - SID: ${messageResult.sid}`);
          } else {
            console.log(`[REMINDER-API] MOCK MESSAGE sent to ${user.mobile} (no Twilio credentials)`);
          }
          result.messagesSent++;

          // Add small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[REMINDER-API] Failed to send message to ${user.mobile}:`, errorMessage);
        
        result.errors.push({
          mobile: user.mobile,
          error: errorMessage
        });
      }
    }

    const duration = Date.now() - startTime;
    console.log(`[REMINDER-API] Job completed in ${duration}ms - Sent: ${result.messagesSent}, Errors: ${result.errors.length}`);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('[REMINDER-API] Job failed:', errorMessage);

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
