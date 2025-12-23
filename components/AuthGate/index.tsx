"use client";

import { useEffect, useRef, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { CustomSignup } from "./CustomSignUp";

export default function AuthGate({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirectedRef = useRef(false);

  // Redirect to resource page if there's a pending YouTube URL
  useEffect(() => {
    if (!isLoaded || !user || !user.publicMetadata?.onboarded) return;

    const pendingUrl = localStorage.getItem("pendingYoutubeUrl");
    // Only redirect if not already on resource page
    if (pendingUrl && !hasRedirectedRef.current && pathname !== "/resource") {
      hasRedirectedRef.current = true;
      // Redirect to resource page without ID - it will handle the processing
      router.push("/resource");
    }
  }, [isLoaded, user?.publicMetadata?.onboarded, pathname]);

  // Track daily login when user is authenticated and onboarded
  useEffect(() => {
    if (isLoaded && user && user.publicMetadata?.onboarded) {
      // Call API to log daily login
      const logDailyLogin = async () => {
        try {
          await axios.post("/api/user/login");
          console.log("Daily login tracked successfully");
        } catch (error) {
          console.error("Error tracking daily login:", error);
          // Don't show error to user, just log it
        }
      };

      logDailyLogin();
    }
  }, [isLoaded, user]);

  if (!isLoaded || !user) return <div></div>;
  if (!user.publicMetadata?.onboarded) {
    return (
      <CustomSignup
        email={user?.primaryEmailAddress?.emailAddress!}
        router={router}
      />
    );
  }

  return children;
}
