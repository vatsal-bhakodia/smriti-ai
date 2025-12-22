"use client";
import React, { useEffect, useState } from "react";
import LeftSidePanel from "../authLeftPanel";
import { SignUp } from "@clerk/nextjs";

const SignUpForm = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Add this useEffect for dark-to-light transitions
  useEffect(() => {
    const addTransitionEffects = () => {
      // Wait for Clerk form to render
      setTimeout(() => {
        const clerkInputs = document.querySelectorAll(
          'input[data-clerk-element="formFieldInput"]'
        );

        clerkInputs.forEach((input) => {
          // Add transition class
          input.classList.add("clerk-transition-input");

          const updateInputState = () => {
            if ((input as HTMLInputElement).value.trim() !== "") {
              input.classList.add("has-content");
            } else {
              input.classList.remove("has-content");
            }
          };

          // Initial state check
          updateInputState();

          // Add event listeners
          input.addEventListener("input", updateInputState);
          input.addEventListener("focus", () => {
            input.classList.add("focused");
          });
          input.addEventListener("blur", () => {
            input.classList.remove("focused");
            updateInputState();
          });
        });
      }, 500);
    };

    addTransitionEffects();

    // Re-run when component updates (for multi-step forms)
    const observer = new MutationObserver(addTransitionEffects);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#1e1e1e]">
      <style jsx global>{`
        /* Dark-to-light transition styles for Clerk inputs */
        input[data-clerk-element="formFieldInput"].clerk-transition-input {
          background-color: #2a2a2a !important;
          color: #ffffff !important;
          border: 2px solid #404040 !important;
          transition: all 0.3s ease !important;
        }

        input[data-clerk-element="formFieldInput"].clerk-transition-input::placeholder {
          color: #888888 !important;
          transition: color 0.3s ease !important;
        }

        /* Focus state - transitions to light */
        input[data-clerk-element="formFieldInput"].clerk-transition-input:focus,
        input[data-clerk-element="formFieldInput"].clerk-transition-input.focused {
          background-color: #ffffff !important;
          color: #333333 !important;
          border-color: #a3ff19 !important;
          box-shadow: 0 0 0 3px rgba(163, 255, 25, 0.1) !important;
        }

        input[data-clerk-element="formFieldInput"].clerk-transition-input:focus::placeholder,
        input[data-clerk-element="formFieldInput"].clerk-transition-input.focused::placeholder {
          color: #999999 !important;
        }

        /* Filled state - stays light when user has typed */
        input[data-clerk-element="formFieldInput"].clerk-transition-input.has-content {
          background-color: #ffffff !important;
          color: #333333 !important;
          border-color: #d1d5db !important;
        }

        input[data-clerk-element="formFieldInput"].clerk-transition-input.has-content::placeholder {
          color: #999999 !important;
        }

        /* Special handling for date inputs */
        input[data-clerk-element="formFieldInput"][type="date"].clerk-transition-input {
          color-scheme: dark !important;
        }

        input[data-clerk-element="formFieldInput"][type="date"].clerk-transition-input:focus,
        input[data-clerk-element="formFieldInput"][type="date"].clerk-transition-input.focused,
        input[data-clerk-element="formFieldInput"][type="date"].clerk-transition-input.has-content {
          color-scheme: light !important;
        }

        /* Date picker icon styling */
        input[data-clerk-element="formFieldInput"][type="date"].clerk-transition-input::-webkit-calendar-picker-indicator {
          filter: invert(1) !important;
          transition: filter 0.3s ease !important;
          cursor: pointer !important;
        }

        input[data-clerk-element="formFieldInput"][type="date"].clerk-transition-input:focus::-webkit-calendar-picker-indicator,
        input[data-clerk-element="formFieldInput"][type="date"].clerk-transition-input.focused::-webkit-calendar-picker-indicator,
        input[data-clerk-element="formFieldInput"][type="date"].clerk-transition-input.has-content::-webkit-calendar-picker-indicator {
          filter: invert(0) !important;
        }

        /* OTP/Verification code inputs */
        input[data-clerk-element="otpCodeFieldInput"].clerk-transition-input,
        input[data-clerk-element="verificationCodeInput"].clerk-transition-input {
          background-color: #2a2a2a !important;
          color: #ffffff !important;
          border: 2px solid #404040 !important;
          transition: all 0.3s ease !important;
        }

        input[data-clerk-element="otpCodeFieldInput"].clerk-transition-input:focus,
        input[data-clerk-element="otpCodeFieldInput"].clerk-transition-input.focused,
        input[data-clerk-element="verificationCodeInput"].clerk-transition-input:focus,
        input[data-clerk-element="verificationCodeInput"].clerk-transition-input.focused {
          background-color: #ffffff !important;
          color: #333333 !important;
          border-color: #a3ff19 !important;
        }

        input[data-clerk-element="otpCodeFieldInput"].clerk-transition-input.has-content,
        input[data-clerk-element="verificationCodeInput"].clerk-transition-input.has-content {
          background-color: #ffffff !important;
          color: #333333 !important;
          border-color: #d1d5db !important;
        }
      `}</style>
      <div className="w-full min-h-screen flex justify-center overflow-hidden">
        {/* Left Column */}
        {isLargeScreen && <LeftSidePanel />}

        {/* Right Column */}
        <div
          className={`flex justify-center m-auto  p-auto ${
            isLargeScreen ? "w-1/2" : "w-full"
          }`}
        >
          <SignUp
            appearance={{
              variables: {
                colorBackground: "#171717",
                colorPrimary: "#a3ff19", // Neon green
                colorPrimaryForeground: "#222", // Button text
                colorForeground: "#fff", // Normal text
                colorInput: "#222", // Input background
                colorBorder: "#333",
                fontSize: "14px",
              },
              elements: {
                cardBox: {
                  boxShadow: "none",
                  width: "500px",
                },
                card: {
                  width: "100%",
                },
                formFieldInput: {
                  backgroundColor: "#222",
                  color: "#fff",
                  border: "2px solid #fff",
                  height: "35px",
                  transition: "all 0.3s ease", // Add transition
                },
                formButtonPrimary: {
                  background: "#a3ff19",
                  color: "#333",
                  border: "none",
                  boxShadow: "0 0 10px #39FF14, 0 0 20px #39FF14",
                  fontWeight: 700,
                },
                formFieldLabel: {
                  color: "#eee",
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
                  transition: "all 0.3s ease", // Add transition
                },
                otpCodeFieldInputs: {
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                },

                verificationCodeInput: {
                  backgroundColor: "#222",
                  color: "#fff",
                  border: "2px solid #fff",
                  borderRadius: "8px",
                  width: "50px",
                  height: "50px",
                  fontSize: "18px",
                  textAlign: "center",
                  transition: "all 0.3s ease", // Add transition
                },

                formFieldInputShowPasswordIcon: {
                  color: "#fff",
                  border: "none",
                  outline: "none",
                  "&:hover": {
                    color: "#a3ff19",
                  },
                },
                formFieldInputHidePasswordIcon: {
                  color: "#fff",
                  border: "none",
                  outline: "none",
                  "&:hover": {
                    color: "#a3ff19",
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </main>
  );
};

export default SignUpForm;
