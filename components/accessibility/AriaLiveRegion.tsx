"use client";

import { useEffect, useRef } from "react";

interface AriaLiveRegionProps {
  message: string;
  priority?: "polite" | "assertive";
  clearAfter?: number; // Clear message after X milliseconds
}

export function AriaLiveRegion({ 
  message, 
  priority = "polite", 
  clearAfter 
}: AriaLiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!clearAfter || !message) return;

    const timer = setTimeout(() => {
      if (regionRef.current) {
        regionRef.current.textContent = "";
      }
    }, clearAfter);

    return () => clearTimeout(timer);
  }, [message, clearAfter]);

  if (!message) return null;

  return (
    <div
      ref={regionRef}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {message}
    </div>
  );
}
