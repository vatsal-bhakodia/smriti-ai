"use client";

import { useEffect, useCallback } from "react";
import { ResultAPIResponse } from "@/types/result";
import { useResultsData, useCaptcha, useLoginForm } from "@/hooks/result";
import { LoadingCard, ResultsView, LoginForm, SyllabusPromo } from "@/components/result";
import { STORAGE_KEYS } from "@/utils/result";

export default function ResultsPage() {
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
    fetchCaptcha();
  }, [setRawResults, setSelectedSemester, resetForm, fetchCaptcha]);

  // Handle refresh captcha with clearing captcha input
  const handleRefreshCaptcha = useCallback(() => {
    refreshCaptcha();
    setCaptcha("");
  }, [refreshCaptcha, setCaptcha]);

  // Load results from sessionStorage on mount and fetch captcha if no results
  useEffect(() => {
    const storedResults = sessionStorage.getItem(STORAGE_KEYS.RESULT_DATA);
    if (storedResults) {
      try {
        const results: ResultAPIResponse[] = JSON.parse(storedResults);
        setRawResults(results);
      } catch (error) {
        console.error("Error parsing stored results:", error);
        fetchCaptcha();
      }
    } else {
      // No results found, show login form
      fetchCaptcha();
    }
  }, [setRawResults, fetchCaptcha]);

  return (
    <>
      {/* Grid pattern overlay - fixed background covering entire viewport */}
      <div
        className="fixed inset-0 opacity-5 -z-10"
        style={{
          backgroundImage: `linear-gradient(#a3ff19 1px, transparent 1px), linear-gradient(90deg, #a3ff19 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
          backgroundRepeat: "repeat",
        }}
      ></div>

      <div className="min-h-[70vh] p-4 relative z-0">
        <div className="w-full max-w-7xl mb-6 mx-auto">
          {!processedData && rawResults.length === 0 ? (
            // Show login form when no results
            <div className="w-full max-w-7xl mx-auto pb-8 flex flex-col items-center justify-center space-y-6">
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
              />
              <SyllabusPromo />
            </div>
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
      </div>
    </>
  );
}
