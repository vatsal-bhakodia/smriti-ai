"use client";

import { useEffect, useCallback } from "react";
import { ResultAPIResponse } from "@/types/result";
import { useResultsData, useCaptcha, useLoginForm } from "@/hooks/result";
import { LoadingCard, ResultsView, LoginForm } from "@/components/result";
import { STORAGE_KEYS } from "@/utils/result";

export default function ResultsContainer() {
  // Results data hook
  const {
    rawResults,
    setRawResults,
    creditsMap,
    processedData,
    selectedSemester,
    setSelectedSemester,
    filteredResults,
    showMarksBreakdown,
    setShowMarksBreakdown,
  } = useResultsData();

  // Captcha hook
  const {
    captchaImage,
    isLoadingCaptcha,
    captchaError,
    fetchCaptcha,
    refreshCaptcha,
  } = useCaptcha();

  // Handle successful login
  const handleLoginSuccess = useCallback((results: ResultAPIResponse[]) => {
    setRawResults(results);
  }, [setRawResults]);

  // Login form hook
  const {
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
  } = useLoginForm({
    onLoginSuccess: handleLoginSuccess,
    onRefreshCaptcha: refreshCaptcha,
  });

  // Combine captcha error with login error
  const displayError = error || captchaError;

  // Handle reset
  const handleReset = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEYS.RESULT_DATA);
    sessionStorage.removeItem(STORAGE_KEYS.CREDITS_DATA);
    sessionStorage.removeItem(STORAGE_KEYS.MANUAL_CREDITS);
    sessionStorage.removeItem(STORAGE_KEYS.MANUAL_CGPA);
    setRawResults([]);
    setSelectedSemester("OVERALL");
    resetForm();
    // Don't fetch captcha on reset - let user go through 2-step process
  }, [setRawResults, setSelectedSemester, resetForm]);

  // Handle refresh captcha with clearing captcha input
  const handleRefreshCaptcha = useCallback(() => {
    refreshCaptcha();
    setCaptcha("");
  }, [refreshCaptcha, setCaptcha]);

  // Handle next step - fetch captcha when user clicks next after entering enrollment
  const handleNextStep = useCallback(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  // Load results from sessionStorage on mount (don't fetch captcha automatically)
  useEffect(() => {
    const storedResults = sessionStorage.getItem(STORAGE_KEYS.RESULT_DATA);
    if (storedResults) {
      try {
        const results: ResultAPIResponse[] = JSON.parse(storedResults);
        setRawResults(results);
      } catch (error) {
        console.error("Error parsing stored results:", error);
      }
    }
  }, [setRawResults]);

  return (
    <div className="w-full max-w-7xl mb-6 md:mb-20 mx-auto">
      {!processedData && rawResults.length === 0 ? (
        <LoginForm
          enrollmentNumber={enrollmentNumber}
          password={password}
          captcha={captcha}
          captchaImage={captchaImage}
          isLoading={isLoading}
          isLoadingCaptcha={isLoadingCaptcha}
          error={displayError}
          onEnrollmentChange={setEnrollmentNumber}
          onPasswordChange={setPassword}
          onCaptchaChange={setCaptcha}
          onRefreshCaptcha={handleRefreshCaptcha}
          onSubmit={handleSubmit}
          onDismissError={() => setError("")}
          onNextStep={handleNextStep}
        />
      ) : processedData ? (
        <ResultsView
          processedData={processedData}
          selectedSemester={selectedSemester}
          onSemesterChange={setSelectedSemester}
          onReset={handleReset}
          filteredResults={filteredResults}
          showMarksBreakdown={showMarksBreakdown}
          onToggleMarksBreakdown={setShowMarksBreakdown}
          creditsMap={creditsMap}
        />
      ) : (
        <LoadingCard />
      )}
    </div>
  );
}
