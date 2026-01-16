"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LoginForm from "@/components/result/LoginForm";
import Banner from "@/components/ads/Banner";
import NativeBanner from "@/components/ads/NativeBanner";

export default function LoginPage() {
  const router = useRouter();
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaImage, setCaptchaImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCaptcha, setIsLoadingCaptcha] = useState(false);
  const [error, setError] = useState<string>("");

  // Fetch captcha image
  const fetchCaptcha = async () => {
    setIsLoadingCaptcha(true);
    try {
      const response = await fetch("/api/result/captcha", {
        credentials: "include",
      });
      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setCaptchaImage(imageUrl);
        setError("");
      } else {
        toast.error("Failed to load captcha. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching captcha:", error);
      toast.error("Failed to load captcha. Please try again.");
    } finally {
      setIsLoadingCaptcha(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
    return () => {
      if (captchaImage) {
        URL.revokeObjectURL(captchaImage);
      }
    };
  }, []);

  const handleRefreshCaptcha = () => {
    if (captchaImage) {
      URL.revokeObjectURL(captchaImage);
    }
    fetchCaptcha();
    setCaptcha("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!enrollmentNumber || !password || !captcha) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/result/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          enrollmentNumber,
          password,
          captcha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.error ||
          data.message ||
          `Login failed with status ${response.status}. Please check your credentials.`;
        setError(errorMessage);
        toast.error(errorMessage);
        handleRefreshCaptcha();
        setIsLoading(false);
        return;
      }

      if (!data.results || data.results.length === 0) {
        const errorMessage =
          "No results found. Please check your enrollment number.";
        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      // Store results in sessionStorage
      sessionStorage.setItem("resultData", JSON.stringify(data.results));

      // Redirect to results page
      router.push("/result");
      toast.success("Results fetched successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      handleRefreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(#a3ff19 1px, transparent 1px), linear-gradient(90deg, #a3ff19 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      ></div>

      <div className="w-full max-w-7xl mx-auto pb-8 flex flex-col items-center justify-center">
        <Banner className="mb-6" />
        <LoginForm
          enrollmentNumber={enrollmentNumber}
          password={password}
          captcha={captcha}
          captchaImage={captchaImage}
          isLoading={isLoading}
          isLoadingCaptcha={isLoadingCaptcha}
          error={error}
          onEnrollmentChange={setEnrollmentNumber}
          onPasswordChange={setPassword}
          onCaptchaChange={setCaptcha}
          onRefreshCaptcha={handleRefreshCaptcha}
          onSubmit={handleSubmit}
        />
      </div>
      <NativeBanner />
    </div>
  );
}
