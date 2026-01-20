"use client";

import { useEffect, useCallback } from "react";
import { ResultAPIResponse } from "@/types/result";
import { useResultsData, useCaptcha, useLoginForm, normalizeResultsPaperCodes } from "@/hooks/result";
import { LoadingCard, ResultsView, LoginForm, SyllabusPromo } from "@/components/result";

export default function ResultsPage() {
  // Results data hook
  const {
    rawResults,
    setRawResults,
    creditsMap,
    setCreditsMap,
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
    sessionStorage.removeItem("resultData");
    sessionStorage.removeItem("demoCreditsMap");
    sessionStorage.removeItem("isDemoMode");
    setRawResults([]);
    setCreditsMap({});
    setSelectedSemester("OVERALL");
    resetForm();
    fetchCaptcha();
  }, [setRawResults, setCreditsMap, setSelectedSemester, resetForm, fetchCaptcha]);

  // Handle demo mode
  const handleDemoMode = useCallback(() => {
    // Mock data for demonstration - 13 subjects with 4 credits each
    const demoData: ResultAPIResponse[] = [
      // Semester 1 - 5 subjects
      {
        nrollno: "00112345678",
        stname: "DEMO STUDENT",
        byoa: 2020,
        yoa: 2020,
        father: "DEMO FATHER",
        prgcode: "B.TECH-CSE",
        prgname: "Bachelor of Technology - Computer Science",
        icode: "001",
        iname: "Demo Institute of Technology",
        euno: 1,
        papercode: "CSE101",
        papername: "Programming in C",
        minorprint: "25",
        majorprint: "70",
        moderatedprint: "95",
        statuscode: "P",
        rmonth: 12,
        ryear: 2020,
        declareddate: "2020-12-30",
        eugpa: 9.75,
      },
      {
        nrollno: "00112345678",
        stname: "DEMO STUDENT",
        byoa: 2020,
        yoa: 2020,
        father: "DEMO FATHER",
        prgcode: "B.TECH-CSE",
        prgname: "Bachelor of Technology - Computer Science",
        icode: "001",
        iname: "Demo Institute of Technology",
        euno: 1,
        papercode: "CSE102",
        papername: "Digital Electronics",
        minorprint: "22",
        majorprint: "63",
        moderatedprint: "85",
        statuscode: "P",
        rmonth: 12,
        ryear: 2020,
        declareddate: "2020-12-30",
        eugpa: 9.75,
      },
      {
        nrollno: "00112345678",
        stname: "DEMO STUDENT",
        byoa: 2020,
        yoa: 2020,
        father: "DEMO FATHER",
        prgcode: "B.TECH-CSE",
        prgname: "Bachelor of Technology - Computer Science",
        icode: "001",
        iname: "Demo Institute of Technology",
        euno: 1,
        papercode: "CSE103",
        papername: "Engineering Mathematics-I",
        minorprint: "24",
        majorprint: "68",
        moderatedprint: "92",
        statuscode: "P",
        rmonth: 12,
        ryear: 2020,
        declareddate: "2020-12-30",
        eugpa: 9.75,
      },
      {
        nrollno: "00112345678",
        stname: "DEMO STUDENT",
        byoa: 2020,
        yoa: 2020,
        father: "DEMO FATHER",
        prgcode: "B.TECH-CSE",
        prgname: "Bachelor of Technology - Computer Science",
        icode: "001",
        iname: "Demo Institute of Technology",
        euno: 1,
        papercode: "CSE104",
        papername: "Physics",
        minorprint: "23",
        majorprint: "65",
        moderatedprint: "88",
        statuscode: "P",
        rmonth: 12,
        ryear: 2020,
        declareddate: "2020-12-30",
        eugpa: 9.75,
      },
      {
        nrollno: "00112345678",
        stname: "DEMO STUDENT",
        byoa: 2020,
        yoa: 2020,
        father: "DEMO FATHER",
        prgcode: "B.TECH-CSE",
        prgname: "Bachelor of Technology - Computer Science",
        icode: "001",
        iname: "Demo Institute of Technology",
        euno: 1,
        papercode: "CSE105",
        papername: "Communication Skills",
        minorprint: "22",
        majorprint: "71",
        moderatedprint: "93",
        statuscode: "P",
        rmonth: 12,
        ryear: 2020,
        declareddate: "2020-12-30",
        eugpa: 9.75,
      },
      // Semester 2 - 4 subjects
      {
        nrollno: "00112345678",
        stname: "DEMO STUDENT",
        byoa: 2020,
        yoa: 2020,
        father: "DEMO FATHER",
        prgcode: "B.TECH-CSE",
        prgname: "Bachelor of Technology - Computer Science",
        icode: "001",
        iname: "Demo Institute of Technology",
        euno: 2,
        papercode: "CSE201",
        papername: "Data Structures",
        minorprint: "24",
        majorprint: "68",
        moderatedprint: "92",
        statuscode: "P",
        rmonth: 5,
        ryear: 2021,
        declareddate: "2021-05-30",
        eugpa: 8.5,
      },
      {
        nrollno: "00112345678",
        stname: "DEMO STUDENT",
        byoa: 2020,
        yoa: 2020,
        father: "DEMO FATHER",
        prgcode: "B.TECH-CSE",
        prgname: "Bachelor of Technology - Computer Science",
        icode: "001",
        iname: "Demo Institute of Technology",
        euno: 2,
        papercode: "CSE202",
        papername: "Object Oriented Programming",
        minorprint: "21",
        majorprint: "55",
        moderatedprint: "76",
        statuscode: "P",
        rmonth: 5,
        ryear: 2021,
        declareddate: "2021-05-30",
        eugpa: 8.5,
      },
      {
        nrollno: "00112345678",
        stname: "DEMO STUDENT",
        byoa: 2020,
        yoa: 2020,
        father: "DEMO FATHER",
        prgcode: "B.TECH-CSE",
        prgname: "Bachelor of Technology - Computer Science",
        icode: "001",
        iname: "Demo Institute of Technology",
        euno: 2,
        papercode: "CSE203",
        papername: "Engineering Mathematics-II",
        minorprint: "22",
        majorprint: "60",
        moderatedprint: "82",
        statuscode: "P",
        rmonth: 5,
        ryear: 2021,
        declareddate: "2021-05-30",
        eugpa: 8.5,
      },
      {
        nrollno: "00112345678",
        stname: "DEMO STUDENT",
        byoa: 2020,
        yoa: 2020,
        father: "DEMO FATHER",
        prgcode: "B.TECH-CSE",
        prgname: "Bachelor of Technology - Computer Science",
        icode: "001",
        iname: "Demo Institute of Technology",
        euno: 2,
        papercode: "CSE204",
        papername: "Computer Organization",
        minorprint: "20",
        majorprint: "58",
        moderatedprint: "78",
        statuscode: "P",
        rmonth: 5,
        ryear: 2021,
        declareddate: "2021-05-30",
        eugpa: 8.5,
      },
      // Semester 3 - 4 subjects
      {
        nrollno: "00112345678",
        stname: "DEMO STUDENT",
        byoa: 2020,
        yoa: 2020,
        father: "DEMO FATHER",
        prgcode: "B.TECH-CSE",
        prgname: "Bachelor of Technology - Computer Science",
        icode: "001",
        iname: "Demo Institute of Technology",
        euno: 3,
        papercode: "CSE301",
        papername: "Database Management Systems",
        minorprint: "23",
        majorprint: "66",
        moderatedprint: "89",
        statuscode: "P",
        rmonth: 12,
        ryear: 2021,
        declareddate: "2021-12-30",
        eugpa: 8.75,
      },
      {
        nrollno: "00112345678",
        stname: "DEMO STUDENT",
        byoa: 2020,
        yoa: 2020,
        father: "DEMO FATHER",
        prgcode: "B.TECH-CSE",
        prgname: "Bachelor of Technology - Computer Science",
        icode: "001",
        iname: "Demo Institute of Technology",
        euno: 3,
        papercode: "CSE302",
        papername: "Operating Systems",
        minorprint: "22",
        majorprint: "64",
        moderatedprint: "86",
        statuscode: "P",
        rmonth: 12,
        ryear: 2021,
        declareddate: "2021-12-30",
        eugpa: 8.75,
      },
      {
        nrollno: "00112345678",
        stname: "DEMO STUDENT",
        byoa: 2020,
        yoa: 2020,
        father: "DEMO FATHER",
        prgcode: "B.TECH-CSE",
        prgname: "Bachelor of Technology - Computer Science",
        icode: "001",
        iname: "Demo Institute of Technology",
        euno: 3,
        papercode: "CSE303",
        papername: "Computer Networks",
        minorprint: "21",
        majorprint: "62",
        moderatedprint: "83",
        statuscode: "P",
        rmonth: 12,
        ryear: 2021,
        declareddate: "2021-12-30",
        eugpa: 8.75,
      },
      {
        nrollno: "00112345678",
        stname: "DEMO STUDENT",
        byoa: 2020,
        yoa: 2020,
        father: "DEMO FATHER",
        prgcode: "B.TECH-CSE",
        prgname: "Bachelor of Technology - Computer Science",
        icode: "001",
        iname: "Demo Institute of Technology",
        euno: 3,
        papercode: "CSE304",
        papername: "Software Engineering",
        minorprint: "24",
        majorprint: "69",
        moderatedprint: "93",
        statuscode: "P",
        rmonth: 12,
        ryear: 2021,
        declareddate: "2021-12-30",
        eugpa: 8.75,
      },
    ];

    // Set credits map with 4 credits for all demo subjects
    const demoCreditsMap = {
      "CSE-101": { theoryCredits: 4, practicalCredits: null, totalCredits: 4 },
      "CSE-102": { theoryCredits: 4, practicalCredits: null, totalCredits: 4 },
      "CSE-103": { theoryCredits: 4, practicalCredits: null, totalCredits: 4 },
      "CSE-104": { theoryCredits: 4, practicalCredits: null, totalCredits: 4 },
      "CSE-105": { theoryCredits: 4, practicalCredits: null, totalCredits: 4 },
      "CSE-201": { theoryCredits: 4, practicalCredits: null, totalCredits: 4 },
      "CSE-202": { theoryCredits: 4, practicalCredits: null, totalCredits: 4 },
      "CSE-203": { theoryCredits: 4, practicalCredits: null, totalCredits: 4 },
      "CSE-204": { theoryCredits: 4, practicalCredits: null, totalCredits: 4 },
      "CSE-301": { theoryCredits: 4, practicalCredits: null, totalCredits: 4 },
      "CSE-302": { theoryCredits: 4, practicalCredits: null, totalCredits: 4 },
      "CSE-303": { theoryCredits: 4, practicalCredits: null, totalCredits: 4 },
      "CSE-304": { theoryCredits: 4, practicalCredits: null, totalCredits: 4 },
    };

    // Normalize paper codes in demo data to match demoCreditsMap keys (with hyphens)
    const normalizedDemoData = normalizeResultsPaperCodes(demoData);
    
    sessionStorage.setItem("resultData", JSON.stringify(normalizedDemoData));
    sessionStorage.setItem("demoCreditsMap", JSON.stringify(demoCreditsMap));
    sessionStorage.setItem("isDemoMode", "true");
    setRawResults(normalizedDemoData);
    setCreditsMap(demoCreditsMap);
    setSelectedSemester("OVERALL");
  }, [setRawResults, setCreditsMap, setSelectedSemester]);

  // Handle refresh captcha with clearing captcha input
  const handleRefreshCaptcha = useCallback(() => {
    refreshCaptcha();
    setCaptcha("");
  }, [refreshCaptcha, setCaptcha]);

  // Load results from sessionStorage on mount and fetch captcha if no results
  useEffect(() => {
    const storedResults = sessionStorage.getItem("resultData");
    const storedCredits = sessionStorage.getItem("demoCreditsMap");
    const isDemoMode = sessionStorage.getItem("isDemoMode");
    
    if (storedResults) {
      try {
        const results: ResultAPIResponse[] = JSON.parse(storedResults);
        setRawResults(results);
        
        // If demo mode, also restore the demo credits
        if (isDemoMode === "true" && storedCredits) {
          const credits = JSON.parse(storedCredits);
          setCreditsMap(credits);
        }
      } catch (error) {
        console.error("Error parsing stored results:", error);
        fetchCaptcha();
      }
    } else {
      // No results found, show login form
      fetchCaptcha();
    }
  }, [setRawResults, setCreditsMap, fetchCaptcha]);

  return (
    <>
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(#a3ff19 1px, transparent 1px), linear-gradient(90deg, #a3ff19 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      ></div>

      <div className="min-h-[70vh] p-4 relative">
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
                onDemoMode={handleDemoMode}
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
