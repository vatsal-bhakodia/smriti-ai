"use client";

import { useUser } from "@clerk/nextjs";

/**
 * Safely use Clerk's useUser hook.
 * Returns default values if Clerk is not configured.
 * Always calls useUser (React rules), but returns defaults if Clerk key is missing.
 */
export function useSafeClerk() {
  // Always call the hook (React rules)
  const clerkResult = useUser();

  // If Clerk is not configured (no valid publishable key), return defaults
  const hasClerkKey = typeof window !== "undefined" 
    ? !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_test_") ||
       process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_live_"))
    : false;

  if (!hasClerkKey) {
    return {
      isSignedIn: false,
      isLoaded: true,
      user: null,
    };
  }

  return clerkResult;
}

