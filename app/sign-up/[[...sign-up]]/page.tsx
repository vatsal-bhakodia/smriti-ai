"use client";

import { SignUp } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import LeftSidePanel from "./leftPanel";

export default function Page() {
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
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="w-full min-h-screen flex justify-center pt-15 overflow-hidden">

        {/* Left Column */}
        {isLargeScreen && (
          <div className="hidden w-1/2 lg:block">
            <LeftSidePanel />
          </div>
        )}

        {/* Right Column */}
        <div
          className={`flex justify-center m-auto p-auto ${
            isLargeScreen ? "w-1/2" : "w-full"
          }`}
        >
          <SignUp
            appearance={{
              variables: {
                colorBackground: "#f6f6f6", // Light mode background
                colorPrimary: "#a3ff19",      // Neon green
                colorPrimaryForeground: "#222", // Button text
                colorForeground: "#111",        // Normal text
                colorInput: "#fff",             // Input background
                colorBorder: "#ccc",            // Light border
                fontSize: "14px",
              },
              elements: {
                cardBox: {
                  boxShadow: "0 0 20px rgba(0,0,0,0.05)", // subtle shadow in light mode
                  width: "500px",
                },
                card: {
                  width: "100%",
                },
                formFieldInput: {
                  backgroundColor: "#fff",
                  color: "#111",
                  border: "1px solid #ccc",
                  height: "35px",
                },
                formButtonPrimary: {
                  background: "#a3ff19",
                  color: "#222",
                  border: "none",
                  boxShadow: "0 0 10px #39FF14, 0 0 20px #39FF14",
                  fontWeight: 700,
                },
                formFieldLabel: { color: "#111" },
                socialButtonsBlockButton__google: {
                  backgroundColor: "#fff",
                  transition: "all 0.2s",
                  width: "420px",
                  height: "40px",
                  margin: "0 auto",
                  border: "1px solid #ccc",
                },
                socialButtonsBlockButtonText: {
                  color: "#111",
                },
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
