import { useState, useEffect } from "react";
import Footer from "@/components/Footer";

export default function TermsOfUse() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Detect system theme
  useEffect(() => {
    setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  return (
    <>
      <div
        className={`max-w-4xl mx-auto px-4 py-10 pt-24 pb-20 ${
          isDarkMode ? "bg-neutral-900" : "bg-gray-50"
        }`}
      >
        <h1
          className={`text-3xl font-bold mb-6 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Terms of Use
        </h1>
        <p
          className={`mb-6 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          These Terms of Use govern your access to and use of Smriti AI and its
          services. By accessing or using any part of the site, you agree to be
          bound by these terms.
        </p>

        <h2
          className={`text-xl font-semibold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          1. Acceptance of Terms
        </h2>
        <p
          className={`mb-6 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          By using this website, you agree to comply with and be legally bound
          by the terms and conditions outlined here. If you do not agree with
          any part of these terms, please refrain from using our services.
        </p>

        <h2
          className={`text-xl font-semibold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          2. Changes to the Terms
        </h2>
        <p
          className={`mb-6 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          We reserve the right to update or modify these Terms at any time
          without prior notice. Continued use of the site after changes
          indicates your acceptance of the new terms.
        </p>

        <h2
          className={`text-xl font-semibold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          3. User Conduct
        </h2>
        <p
          className={`mb-6 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Users agree not to misuse the site or its content. Any illegal,
          harmful, or abusive behavior will result in immediate termination of
          access.
        </p>

        <h2
          className={`text-xl font-semibold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          4. Contact
        </h2>
        <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
          If you have any questions regarding these Terms of Use, please contact
          us through our support page.
        </p>
      </div>
      <Footer />
    </>
  );
}
