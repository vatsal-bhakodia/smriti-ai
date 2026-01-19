"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ResultAPIResponse } from "@/types/result";
import { normalizeResultsPaperCodes } from "./useResultsData";

interface UseLoginFormProps {
  onLoginSuccess: (results: ResultAPIResponse[]) => void;
  onRefreshCaptcha: () => void;
}

interface UseLoginFormReturn {
  enrollmentNumber: string;
  setEnrollmentNumber: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  captcha: string;
  setCaptcha: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

export function useLoginForm({
  onLoginSuccess,
  onRefreshCaptcha,
}: UseLoginFormProps): UseLoginFormReturn {
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const resetForm = useCallback(() => {
    setEnrollmentNumber("");
    setPassword("");
    setCaptcha("");
    setError("");
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
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
          onRefreshCaptcha();
          setIsLoading(false);
          return;
        }

        if (!data.results || data.results.length === 0) {
          const errorMessage =
            "No results found. Please check your enrollment number.";
          setError(errorMessage);
          setIsLoading(false);
          return;
        }

        // Normalize paper codes once when data is received
        const normalizedResults = normalizeResultsPaperCodes(data.results);

        // Store normalized results in sessionStorage
        sessionStorage.setItem("resultData", JSON.stringify(normalizedResults));

        // Notify parent and clear form
        onLoginSuccess(normalizedResults);
        resetForm();
        toast.success("Results fetched successfully!");
      } catch (error) {
        console.error("Error submitting form:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.";
        setError(errorMessage);
        onRefreshCaptcha();
      } finally {
        setIsLoading(false);
      }
    },
    [enrollmentNumber, password, captcha, onLoginSuccess, onRefreshCaptcha, resetForm]
  );

  return {
    enrollmentNumber,
    setEnrollmentNumber,
    password,
    setPassword,
    captcha,
    setCaptcha,
    isLoading,
    error,
    setError,
    handleSubmit,
    resetForm,
  };
}
