"use client";

import { useEffect, useState, FormEvent, ReactNode } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function AuthGate({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();

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
        userId={user?.id!}
      />
    );
  }

  return children;
}

function CustomSignup({ email, userId }: { email: string; userId: string }) {
  const [phone, setPhone] = useState<string>("");
  const [dob, setDob] = useState<string>(""); // Use date string
  const [username, setUsername] = useState<string>("");
  const [defaultCountry, setDefaultCountry] = useState<string>("in");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneCountry, setPhoneCountry] = useState<string>("in");

  // Detect country for phone input
  useEffect(() => {
    fetch("https://ipapi.co/json")
      .then((res) => res.json())
      .then((data) => {
        if (data?.country_code) {
          const countryCode = data.country_code.toLowerCase();
          setDefaultCountry(countryCode);
          setPhoneCountry(countryCode);
        }
      })
      .catch(() => {
        setDefaultCountry("in");
        setPhoneCountry("in");
      });
  }, []);
       useEffect(() => {
   const timer = setTimeout(() => {
      // Handle regular inputs (text and date)
      const inputs = document.querySelectorAll('input[type="text"], input[type="date"]');
      
      function hasContent(input: HTMLInputElement) {
        return input.value.trim() !== '';
      }
      
      function updateInputState(input: HTMLInputElement) {
        if (hasContent(input)) {
          input.classList.add('has-content');
        } else {
          input.classList.remove('has-content');
        }
      }
    
    inputs.forEach(input => {
      const htmlInput = input as HTMLInputElement;
      // Check initial state
      updateInputState(htmlInput);
      
      // Check initial state
        updateInputState(htmlInput);
        
        // Add event listeners
        const handleInput = () => updateInputState(htmlInput);
        const handleFocus = () => htmlInput.classList.add('focused');
        const handleBlur = () => {
          htmlInput.classList.remove('focused');
          updateInputState(htmlInput);
        };
        
        htmlInput.addEventListener('input', handleInput);
        htmlInput.addEventListener('focus', handleFocus);
        htmlInput.addEventListener('blur', handleBlur);
      });

      // Handle PhoneInput component specifically
      const phoneInput = document.querySelector('.react-tel-input .form-control') as HTMLInputElement;
      if (phoneInput) {
        function updatePhoneState() {
          if (phone.trim() !== '') {
            phoneInput.classList.add('has-content');
          } else {
            phoneInput.classList.remove('has-content');
          }
        }

        // Initial state
        updatePhoneState();

        const handlePhoneFocus = () => phoneInput.classList.add('focused');
        const handlePhoneBlur = () => {
          phoneInput.classList.remove('focused');
          updatePhoneState();
        };
        const handlePhoneInput = () => updatePhoneState();

        phoneInput.addEventListener('focus', handlePhoneFocus);
        phoneInput.addEventListener('blur', handlePhoneBlur);
        phoneInput.addEventListener('input', handlePhoneInput);
      }
    }, 200);
    
    return () => {
      clearTimeout(timer);
    };
  }, [phone]); // Add phone as dependency to update when phone changes

  // Handle phone input changes
  const handlePhoneChange = (value: string, countryData?: any) => {
    setPhone(value);
    // Update country if it was changed via the dropdown
    if (
      countryData &&
      countryData.countryCode &&
      countryData.countryCode !== phoneCountry
    ) {
      setPhoneCountry(countryData.countryCode);
    }
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post<{ message: string }>("/api/create-user", {
        email,
        mobile: `+${phone}`,
        dob,
        username,
      });

      if (res.status === 201) {
        toast.success(res.data.message);
        window.location.reload();
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Signup failed";

      if (errorMessage.includes("Username is already taken")) {
        toast.error("Username is already taken. Please try a different one.");
      } else if (errorMessage.includes("Invalid mobile number")) {
        toast.error("Enter a valid mobile number.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center bg-black text-white min-h-screen w-full px-4">
      {/* ADD THIS STYLE TAG FOR CSS */}
      <style jsx global>{`
        /* Dark-to-light transition styles for dashboard form */
        input[type="text"], input[type="date"] {
          background-color: #2a2a2a !important;
          color: #ffffff !important;
          border: 2px solid #404040 !important;
          transition: all 0.3s ease !important;
        }
        
        input[type="text"]::placeholder, input[type="date"]::placeholder {
          color: #888888 !important;
          transition: color 0.3s ease !important;
        }
        
        /* Focus state - transitions to light */
        input[type="text"]:focus, input[type="text"].focused,
        input[type="date"]:focus, input[type="date"].focused {
          background-color: #ffffff !important;
          color: #333333 !important;
          border-color: #a3ff19 !important;
          box-shadow: 0 0 0 3px rgba(163, 255, 25, 0.1) !important;
        }
        
        input[type="text"]:focus::placeholder, input[type="text"].focused::placeholder,
        input[type="date"]:focus::placeholder, input[type="date"].focused::placeholder {
          color: #999999 !important;
        }
        
        /* Filled state - stays light when user has typed */
        input[type="text"].has-content, input[type="date"].has-content {
          background-color: #ffffff !important;
          color: #333333 !important;
          border-color: #d1d5db !important;
        }
        
        input[type="text"].has-content::placeholder, input[type="date"].has-content::placeholder {
          color: #999999 !important;
        }
        
        /* Date input specific styling */
        input[type="date"] {
          color-scheme: dark !important;
        }
        
        input[type="date"]:focus, input[type="date"].focused,
        input[type="date"].has-content {
          color-scheme: light !important;
        }
        
        /* Date picker icon styling */
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1) !important;
          transition: filter 0.3s ease !important;
          cursor: pointer !important;
        }
        
        input[type="date"]:focus::-webkit-calendar-picker-indicator,
        input[type="date"].focused::-webkit-calendar-picker-indicator,
        input[type="date"].has-content::-webkit-calendar-picker-indicator {
          filter: invert(0) !important;
        }
        
        /* Phone input styling - enhanced for dark-to-light transitions */
        .react-tel-input .form-control {
          background-color: #2a2a2a !important;
          color: #ffffff !important;
          border: 2px solid #404040 !important;
          transition: all 0.3s ease !important;
        }
        
        .react-tel-input .form-control::placeholder {
          color: #888888 !important;
          transition: color 0.3s ease !important;
        }
        
        .react-tel-input .form-control:focus,
        .react-tel-input .form-control.focused {
          background-color: #ffffff !important;
          color: #333333 !important;
          border-color: #a3ff19 !important;
          box-shadow: 0 0 0 3px rgba(163, 255, 25, 0.1) !important;
        }
        
        .react-tel-input .form-control:focus::placeholder,
        .react-tel-input .form-control.focused::placeholder {
          color: #999999 !important;
        }
        
        .react-tel-input .form-control.has-content {
          background-color: #ffffff !important;
          color: #333333 !important;
          border-color: #d1d5db !important;
        }
        
        .react-tel-input .form-control.has-content::placeholder {
          color: #999999 !important;
        }
        
        /* Flag dropdown button styling */
        .react-tel-input .flag-dropdown {
          background-color: #2a2a2a !important;
          border: 2px solid #404040 !important;
          border-right: none !important;
          transition: all 0.3s ease !important;
        }
        
        .react-tel-input .form-control:focus + .flag-dropdown,
        .react-tel-input .form-control.focused + .flag-dropdown,
        .react-tel-input .form-control.has-content + .flag-dropdown {
          background-color: #ffffff !important;
          border-color: #d1d5db !important;
        }
        
        .react-tel-input .form-control:focus + .flag-dropdown {
          border-color: #a3ff19 !important;
        }
      `}</style>
      
      <header className="text-2xl font-semibold mb-2">
        Get started with Smriti AI
      </header>
      <section className="text-gray-400 mb-6 text-center max-w-md">
        Seems like you are new here. Just fill out this quick form to get
        started.
      </section>

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-6 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        {/* Username */}
        <div>
          <label className="block mb-1 text-sm font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white outline-none focus:ring-2 ring-primary"
          />
        </div>

        {/* Mobile number */}
        <div>
          <label className="block mb-1 text-sm font-medium">Mobile No.</label>
          <div className="relative">
            <PhoneInput
              country={phoneCountry}
              value={phone}
              onChange={handlePhoneChange}
              enableSearch
              preferredCountries={["in", "us"]}
              autoFormat={true}
              disableDropdown={false}
              countryCodeEditable={false}
              preserveOrder={["onlyCountries", "preferredCountries"]}
              enableAreaCodes={false}
              disableSearchIcon={true}
              placeholder="Enter phone number"
              specialLabel=""
              masks={{
                in: "..... .....",
                us: "(...) ...-....",
                gb: ".... ......",
                ca: "(...) ...-....",
              }}
              inputStyle={{
                width: "100%",
                backgroundColor: "#27272a",
                color: "white",
                border: "1px solid #3f3f46",
                borderRadius: "8px",
                padding: "8px 12px 8px 75px",
                height: "42px",
                fontSize: "16px",
                outline: "none",
                boxSizing: "border-box",
              }}
              buttonStyle={{
                backgroundColor: "transparent",
                border: "none",
                borderRadius: "8px 0 0 8px",
                padding: "8px",
                height: "42px",
                position: "absolute",
                left: "0",
                top: "0",
                zIndex: "10",
                width: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              dropdownStyle={{
                backgroundColor: "#27272a",
                border: "1px solid #3f3f46",
                borderRadius: "8px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                zIndex: "9999",
                maxHeight: "200px",
                overflowY: "auto",
                marginTop: "4px",
              }}
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Date of Birth
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white outline-none focus:ring-2 ring-primary"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-primary text-black font-semibold hover:opacity-90 transition"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Submit"}
        </button>
      </form>
    </div>
  );
}