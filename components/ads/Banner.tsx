"use client";

import Script from "next/script";
import { useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";

interface BannerProps {
  size?: "468x60" | "300x250";
  className?: string;
}

const AD_CONFIGS = {
  "468x60": {
    key: "e90f9eba5a21ca66463a04c9137aaefc",
    width: 468,
    height: 60,
  },
  "300x250": {
    key: "5fa3ee054f8f7fb057e0dbe8b5cc18dd",
    width: 300,
    height: 250,
  },
};

export default function Banner({ size = "468x60", className }: BannerProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);

  const adConfig = useMemo(() => AD_CONFIGS[size], [size]);

  // Set atOptions and ensure container exists before script loads
  useEffect(() => {
    // Set atOptions before script loads
    (window as any).atOptions = {
      key: adConfig.key,
      format: "iframe",
      height: adConfig.height,
      width: adConfig.width,
      params: {},
    };

    // Monitor for iframe creation and move it to correct container if needed
    const observer = new MutationObserver(() => {
      const container = adContainerRef.current;
      if (!container) return;

      // Check if iframe was added to body or elsewhere
      const iframes = document.querySelectorAll(
        `iframe[src="about:blank"][width="${adConfig.width}"][height="${adConfig.height}"]`
      );

      iframes.forEach((iframe) => {
        const parent = iframe.parentElement;
        // If iframe is not in our container, move it
        if (parent && parent !== container && !container.contains(iframe)) {
          container.appendChild(iframe);
        }
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [adConfig]);

  return (
    <div
      className={cn("w-full flex justify-center", className)}
      style={{ minHeight: `${adConfig.height}px` }}
    >
      <Script
        async
        src={`https://www.highperformanceformat.com/${adConfig.key}/invoke.js`}
        strategy="lazyOnload"
        onLoad={() => {
          // After script loads, ensure iframe is in correct container
          setTimeout(() => {
            const container = adContainerRef.current;
            if (container) {
              const iframes = document.querySelectorAll(
                `iframe[src="about:blank"][width="${adConfig.width}"][height="${adConfig.height}"]`
              );
              iframes.forEach((iframe) => {
                const parent = iframe.parentElement;
                if (
                  parent &&
                  parent !== container &&
                  !container.contains(iframe)
                ) {
                  container.appendChild(iframe);
                }
              });
            }
          }, 100);
        }}
      />
      <div
        ref={adContainerRef}
        id={`container-${adConfig.key}`}
        className="w-full flex justify-center"
      ></div>
    </div>
  );
}
