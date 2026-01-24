"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function LoadingCard() {
  return (
    <div className="h-[70vh] flex items-center justify-center">
      <Card className="bg-zinc-900/95 border-zinc-800 max-w-md mx-auto shadow-2xl backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center gap-6">
            {/* Animated Spinner */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-lime-500/20 blur-xl animate-pulse"></div>
              <div className="relative bg-zinc-800 rounded-full p-4 border border-zinc-700">
                <Loader2 className="w-12 h-12 text-lime-500 animate-spin" />
              </div>
            </div>

            {/* Loading Text */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">
                Loading Results
              </h3>
              <p className="text-sm text-zinc-400">
                Please wait while we fetch your data...
              </p>
            </div>

            {/* Animated Dots */}
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
