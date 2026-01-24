"use client";
import { SignIn } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import LeftSidePanel from "@/components/authLeftPanel";

export default function SignInForm() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#1e1e1e]">
      <div className="w-full min-h-screen flex justify-center overflow-hidden">
        {/* Left Column */}
        {isLargeScreen && <LeftSidePanel />}

        {/* Right Column */}
        <div
          className={`flex justify-center m-auto p-auto ${
            isLargeScreen ? "w-1/2" : "w-full"
          }`}
        >
          <SignIn />
        </div>
      </div>
    </main>
  );
}
