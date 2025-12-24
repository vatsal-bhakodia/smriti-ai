import { useEffect, useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Check, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import "./AuthGate.css";

export function CustomSignup({
  email,
  router,
}: {
  email: string;
  router: ReturnType<typeof useRouter>;
}) {
  const { user } = useUser();
  const [phone, setPhone] = useState<string>("");
  const [dob, setDob] = useState<Date>();
  const [username, setUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneCountry, setPhoneCountry] = useState<string>("in");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "available" | "taken"
  >("idle");
  const usernameCheckTimeout = useRef<NodeJS.Timeout | null>(null);

  // Generate username from Clerk user data
  useEffect(() => {
    const generateUsername = async () => {
      if (!user) return;

      let baseUsername = "";

      // Try to get name from Clerk (firstName, lastName, or fullName)
      if (user.firstName) {
        baseUsername = user.firstName.toLowerCase().replace(/[^a-z0-9]/g, "");
      } else if (user.fullName) {
        baseUsername = user.fullName
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace(/[^a-z0-9]/g, "");
      } else {
        // Fallback to email prefix
        baseUsername = email
          .split("@")[0]
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");
      }

      // Ensure minimum length
      if (baseUsername.length < 3) {
        baseUsername = baseUsername + "user";
      }

      // Truncate if too long
      if (baseUsername.length > 15) {
        baseUsername = baseUsername.substring(0, 15);
      }

      // Check if username is available
      let finalUsername = baseUsername;
      let isAvailable = false;
      let attempt = 0;

      while (!isAvailable && attempt < 10) {
        try {
          const res = await axios.post<{
            available: boolean;
            username: string;
          }>("/api/check-username", {
            username: finalUsername,
          });

          if (res.data.available) {
            isAvailable = true;
            setUsername(finalUsername);
            setUsernameStatus("available");
          } else {
            // Try variations
            attempt++;
            if (attempt === 1) {
              // Add underscore
              finalUsername =
                baseUsername + "_" + Math.floor(Math.random() * 99);
            } else if (attempt === 2) {
              // Add period
              finalUsername =
                baseUsername + "." + Math.floor(Math.random() * 99);
            } else {
              // Add random alphanumeric
              const randomStr = Math.random().toString(36).substring(2, 5);
              finalUsername = baseUsername + randomStr;
            }
          }
        } catch (error) {
          console.error("Error checking username:", error);
          break;
        }
      }
    };

    generateUsername();
  }, [user, email]);

  // Detect country for phone input
  useEffect(() => {
    fetch("https://ipapi.co/json")
      .then((res) => res.json())
      .then((data) => {
        if (data?.country_code) {
          const countryCode = data.country_code.toLowerCase();
          setPhoneCountry(countryCode);
        }
      })
      .catch(() => {
        setPhoneCountry("in");
      });
  }, []);
  // Check username availability on change
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameStatus("idle");
      return;
    }

    // Clear previous timeout
    if (usernameCheckTimeout.current) {
      clearTimeout(usernameCheckTimeout.current);
    }

    setIsCheckingUsername(true);

    // Debounce username check
    usernameCheckTimeout.current = setTimeout(async () => {
      try {
        const res = await axios.post<{ available: boolean; username: string }>(
          "/api/check-username",
          { username }
        );
        setUsernameStatus(res.data.available ? "available" : "taken");
      } catch (error) {
        console.error("Error checking username:", error);
        setUsernameStatus("idle");
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500);

    return () => {
      if (usernameCheckTimeout.current) {
        clearTimeout(usernameCheckTimeout.current);
      }
    };
  }, [username]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Handle regular inputs (text)
      const inputs = document.querySelectorAll('input[type="text"]');

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
        updateInputState(htmlInput);

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
  }, [phone]);

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

    // Validation
    if (usernameStatus === "taken") {
      toast.error("Please choose a different username.");
      return;
    }

    if (!dob) {
      toast.error("Please select your date of birth.");
      return;
    }

    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid mobile number.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post<{ message: string }>("/api/create-user", {
        email,
        mobile: `+${phone}`,
        dob: format(dob, "yyyy-MM-dd"),
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
    <div className="flex flex-col items-center justify-center bg-linear-to-br from-black via-zinc-950 to-zinc-900 text-white min-h-screen w-full px-4 py-8">
      <div className="mb-8 text-center">
        <header className="text-3xl md:text-4xl font-bold mb-3 text-white">
          Welcome to Smriti AI
        </header>
        <section className="text-gray-400 text-sm md:text-base max-w-md">
          Let's set up your account in just a few seconds
        </section>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-zinc-800 w-full max-w-md space-y-6"
      >
        {/* Username */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Username
          </label>
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              required
              minLength={3}
              maxLength={20}
              pattern="[a-z0-9_.]+"
              className="w-full px-4 py-3 pr-10 rounded-xl bg-zinc-800/50 text-white outline-none focus:ring-2 ring-primary border border-zinc-700 focus:border-primary transition-all"
              placeholder="Enter your username"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isCheckingUsername && (
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              )}
              {!isCheckingUsername && usernameStatus === "available" && (
                <Check className="h-5 w-5 text-green-500" />
              )}
              {!isCheckingUsername && usernameStatus === "taken" && (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>
          </div>
          {usernameStatus === "taken" && (
            <p className="text-red-400 text-xs mt-1">
              Username is already taken
            </p>
          )}
          {usernameStatus === "available" && (
            <p className="text-green-400 text-xs mt-1">Username is available</p>
          )}
        </div>

        {/* Mobile number */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Mobile Number
          </label>
          <div className="relative phone-input-wrapper">
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
                backgroundColor: "rgba(39, 39, 42, 0.5)",
                color: "white",
                border: "1px solid #3f3f46",
                borderRadius: "12px",
                padding: "12px 12px 12px 75px",
                height: "48px",
                fontSize: "16px",
                outline: "none",
                boxSizing: "border-box",
              }}
              buttonStyle={{
                backgroundColor: "transparent",
                border: "none",
                borderRadius: "12px 0 0 12px",
                padding: "8px",
                height: "48px",
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
                borderRadius: "12px",
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
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Date of Birth
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-zinc-800/50 text-white outline-none focus:ring-2 ring-primary border border-zinc-700 focus:border-primary transition-all text-left flex items-center justify-between",
                  !dob && "text-gray-400"
                )}
              >
                <span>
                  {dob ? format(dob, "PPP") : "Pick your date of birth"}
                </span>
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-700">
              <Calendar
                mode="single"
                selected={dob}
                onSelect={setDob}
                disabled={(date: Date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                captionLayout="dropdown"
                className="bg-zinc-900"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-primary text-black font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={isLoading || usernameStatus === "taken"}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Setting up your account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    </div>
  );
}
