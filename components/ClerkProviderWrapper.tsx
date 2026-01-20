"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";
import { clerkAppearance } from "@/app/clerkAppearance";

interface ClerkProviderWrapperProps {
  children: ReactNode;
  publishableKey?: string;
}

/**
 * Wrapper for ClerkProvider that handles missing keys gracefully.
 * Only renders ClerkProvider if a valid key is provided.
 * In production, the key will always be set, so ClerkProvider will render.
 * In dev without key, components using useSafeClerk will handle the missing provider.
 */
export function ClerkProviderWrapper({
  children,
  publishableKey,
}: ClerkProviderWrapperProps) {
  // Check if we have a valid key
  const hasValidKey =
    publishableKey &&
    (publishableKey.startsWith("pk_test_") ||
      publishableKey.startsWith("pk_live_")) &&
    publishableKey.length > 20;

  // Only render ClerkProvider if we have a valid key
  // In production, this will always be true (key will be set)
  // In dev without key, return children without provider
  // Components using Clerk hooks should handle missing provider gracefully
  if (!hasValidKey) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider appearance={clerkAppearance} publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
}

