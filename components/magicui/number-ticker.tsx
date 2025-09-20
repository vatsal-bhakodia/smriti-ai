"use client";

import { useInView, useMotionValue, useSpring } from "motion/react";
import { ComponentPropsWithoutRef, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number;
  startValue?: number;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
  suffix?: string; 
  enableKFormat?: boolean; 
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  suffix = "",
  enableKFormat = false,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : startValue);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  // Internal formatting function
  const formatNumber = (num: number) => {
    if (enableKFormat && num >= 1000 && suffix === "+") {
      const kValue = Math.floor(num / 1000);
      return `${kValue}k+`;
    }
    
    if (decimalPlaces > 0) {
      return `${num.toFixed(decimalPlaces)}${suffix}`;
    }
    
    return `${Math.floor(num)}${suffix}`;
  };

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(direction === "down" ? startValue : value);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [motionValue, isInView, delay, value, direction, startValue]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          const numericValue = Number(latest.toFixed(decimalPlaces));
          ref.current.textContent = formatNumber(numericValue);
        }
      }),
    [springValue, decimalPlaces, suffix, enableKFormat, value]
  );

  return (
    <span
      ref={ref}
      className={cn("inline-block tabular-nums tracking-wide", className)}
      {...props}
    >
      {formatNumber(startValue)}
    </span>
  );
}