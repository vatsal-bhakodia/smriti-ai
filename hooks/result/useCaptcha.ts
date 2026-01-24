"use client";

import { useState, useEffect, useCallback } from "react";

interface UseCaptchaReturn {
  captchaImage: string;
  isLoadingCaptcha: boolean;
  captchaError: string;
  fetchCaptcha: () => Promise<void>;
  refreshCaptcha: () => void;
  clearCaptchaError: () => void;
}

export function useCaptcha(): UseCaptchaReturn {
  const [captchaImage, setCaptchaImage] = useState<string>("");
  const [isLoadingCaptcha, setIsLoadingCaptcha] = useState(false);
  const [captchaError, setCaptchaError] = useState<string>("");

  // Fetch captcha image
  const fetchCaptcha = useCallback(async () => {
    setIsLoadingCaptcha(true);
    try {
      const response = await fetch("/api/result/captcha", {
        credentials: "include",
      });
      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setCaptchaImage(imageUrl);
        setCaptchaError(""); // Clear any previous error
      } else {
        setCaptchaError("IPU Portal is currently down. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching captcha:", error);
      setCaptchaError("IPU Portal is currently down. Please try again later.");
    } finally {
      setIsLoadingCaptcha(false);
    }
  }, []);

  const refreshCaptcha = useCallback(() => {
    if (captchaImage) {
      URL.revokeObjectURL(captchaImage);
    }
    fetchCaptcha();
  }, [captchaImage, fetchCaptcha]);

  const clearCaptchaError = useCallback(() => {
    setCaptchaError("");
  }, []);

  // Cleanup captcha image URL on unmount or when it changes
  useEffect(() => {
    return () => {
      if (captchaImage) {
        URL.revokeObjectURL(captchaImage);
      }
    };
  }, [captchaImage]);

  return {
    captchaImage,
    isLoadingCaptcha,
    captchaError,
    fetchCaptcha,
    refreshCaptcha,
    clearCaptchaError,
  };
}
