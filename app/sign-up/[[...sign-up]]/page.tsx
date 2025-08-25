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
    <main className="min-h-screen flex items-center justify-center bg-neutral-900">
      <div className="w-full min-h-screen flex justify-center pt-15 overflow-hidden">

        {/* Left Column */}
        {isLargeScreen && (
          <div className="hidden w-1/2 bg-[#111] lg:block">
            <LeftSidePanel/>
          </div>
        )}

        {/* Right Column */}
        <div
          className={`flex justify-center m-auto p-auto ${isLargeScreen ? 'w-1/2' : 'w-full'}`}
        >
          <SignUp
            appearance={{
              variables: {
                colorBackground: "#171717",
                colorPrimary: "#a3ff19",
                colorPrimaryForeground: "#222",
                colorForeground: "#fff",
                colorInput: "#222",
                colorBorder: "#333",
                fontSize: "14px",
              },
              elements: {
                cardBox: {
                  boxShadow: "none",
                  width: "500px",
                },
                card: {
                  width: "100%"
                },
                formFieldInput: {
                  backgroundColor: "#222",
                  color: "#fff",
                  border: "1px solid #fff",
                  height: "35px"
                },
                formButtonPrimary: {
                  background: "#a3ff19",
                  color: "#333",
                  border: "none",
                  boxShadow: "0 0 10px #39FF14, 0 0 20px #39FF14",
                  fontWeight: 700
                },
                formFieldLabel: { 
                  color: "#eee" 
                },
                socialButtonsBlockButton__google: {
                  backgroundColor: "#222",
                  transition: "all 0.2s",
                  width: "420px",
                  height: "40px",
                  margin: "0 auto",
                },
                socialButtonsBlockButtonText: {
                  color: "#fff",
                },
                // OTP Input Styling
                otpCodeFieldInput: {
                  backgroundColor: "#222",
                  color: "#fff",
                  border: "2px solid #fff",
                  borderRadius: "8px",
                  width: "50px",
                  height: "50px",
                  fontSize: "18px",
                  textAlign: "center",
                  margin: "0 5px",
                },
                otpCodeFieldInputs: {
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                },
                // Alternative selectors for OTP inputs
                formFieldInputShowPasswordButton: {
                  color: "#fff",
                },
                // If OTP uses different class names
                verificationCodeInput: {
                  backgroundColor: "#222 !important",
                  color: "#fff !important",
                  border: "2px solid #fff !important",
                  borderRadius: "8px",
                  width: "50px",
                  height: "50px",
                  fontSize: "18px",
                  textAlign: "center",
                },
              }
            }} 
          />
        </div>
      </div>
    </main>
  );
}