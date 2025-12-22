"use client";

import { useEffect, useState, useRef, FormEvent, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import "./AuthGate.css";

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
        userId={user?.id!}
        router={router}
      />
    );
  }

  return children;
}

function CustomSignup({
  email,
  userId,
  router,
}: {
  email: string;
  userId: string;
  router: ReturnType<typeof useRouter>;
}) {
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
      const inputs = document.querySelectorAll(
        'input[type="text"], input[type="date"]'
      );

      function hasContent(input: HTMLInputElement) {
        return input.value.trim() !== "";
      }

      function updateInputState(input: HTMLInputElement) {
        if (hasContent(input)) {
          input.classList.add("has-content");
        } else {
          input.classList.remove("has-content");
        }
      }

      inputs.forEach((input) => {
        const htmlInput = input as HTMLInputElement;
        // Check initial state
        updateInputState(htmlInput);

        // Check initial state
        updateInputState(htmlInput);

        // Add event listeners
        const handleInput = () => updateInputState(htmlInput);
        const handleFocus = () => htmlInput.classList.add("focused");
        const handleBlur = () => {
          htmlInput.classList.remove("focused");
          updateInputState(htmlInput);
        };

        htmlInput.addEventListener("input", handleInput);
        htmlInput.addEventListener("focus", handleFocus);
        htmlInput.addEventListener("blur", handleBlur);
      });

      // Handle PhoneInput component specifically
      const phoneInput = document.querySelector(
        ".react-tel-input .form-control"
      ) as HTMLInputElement;
      if (phoneInput) {
        function updatePhoneState() {
          if (phone.trim() !== "") {
            phoneInput.classList.add("has-content");
          } else {
            phoneInput.classList.remove("has-content");
          }
        }

        // Initial state
        updatePhoneState();

        const handlePhoneFocus = () => phoneInput.classList.add("focused");
        const handlePhoneBlur = () => {
          phoneInput.classList.remove("focused");
          updatePhoneState();
        };
        const handlePhoneInput = () => updatePhoneState();

        phoneInput.addEventListener("focus", handlePhoneFocus);
        phoneInput.addEventListener("blur", handlePhoneBlur);
        phoneInput.addEventListener("input", handlePhoneInput);
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

        // Check if there's a pending YouTube URL
        const pendingUrl = localStorage.getItem("pendingYoutubeUrl");
        if (pendingUrl) {
          // Redirect to resource page - it will handle the processing
          router.push("/resource");
        } else {
          window.location.reload();
        }
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
