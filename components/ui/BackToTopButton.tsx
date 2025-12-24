"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [shouldMoveUp, setShouldMoveUp] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Check if we're near the bottom of the page
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

      // If we're within 100px of the bottom, move the button up
      setShouldMoveUp(distanceFromBottom < 100);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    setIsScrolling(true);

    // Smooth scroll with custom animation
    const scrollStep = -window.scrollY / (500 / 15); // 500ms duration
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
        setIsScrolling(false);
      }
    }, 15);
  };

  return (
    <button
      onClick={scrollToTop}
      disabled={isScrolling}
      className={`
        fixed right-6 z-50 p-3 rounded-full shadow-xl
        bg-linear-to-r from-neutral-600 to-neutral-800 hover:from-neutral-700 hover:to-neutral-900
        text-white border-2 border-white/20
        transform transition-all duration-500 ease-out
        hover:scale-110 hover:shadow-2xl active:scale-95
        ${
          isVisible
            ? "opacity-100 translate-y-0 rotate-0"
            : "opacity-0 translate-y-8 rotate-180 pointer-events-none"
        }
        ${isScrolling ? "animate-pulse" : ""}
        ${shouldMoveUp ? "bottom-24" : "bottom-6"}
      `}
      aria-label="Back to Top"
    >
      <ArrowUp
        className={`
          w-5 h-5 transition-transform duration-300
          ${isScrolling ? "animate-bounce" : ""}
        `}
      />
    </button>
  );
}
