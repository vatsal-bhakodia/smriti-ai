"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ArrowRightIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const HeroForm = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  }, []);

  const handleGetStarted = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!youtubeUrl.trim()) {
      toast.error("Please enter a YouTube URL");
      return;
    }

    // Validate YouTube URL
    const videoIdMatch = youtubeUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    if (!videoIdMatch) {
      toast.error("Please enter a valid YouTube URL");
      return;
    }

    // If user is signed in and onboarded, create resource directly and navigate
    if (isLoaded && isSignedIn && user?.publicMetadata?.onboarded) {
      setIsProcessing(true);
      try {
        // Get or create "My Resources" folder
        const folderResponse = await axios.get<{ folder: { id: string } }>(
          "/api/folder/default"
        );
        const folderId = folderResponse.data.folder.id;

        // Get video title from YouTube API
        const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        if (!API_KEY) {
          toast.error("YouTube API key is missing");
          setIsProcessing(false);
          return;
        }

        const videoId = videoIdMatch[1];
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`;
        const res = await fetch(apiUrl);
        const data = await res.json();
        const videoTitle = data.items?.[0]?.snippet?.title;

        if (!videoTitle) {
          toast.error("Failed to fetch video title");
          setIsProcessing(false);
          return;
        }

        // Create resource
        const resourceResponse = await axios.post<{ resource: { id: string } }>(
          "/api/resource",
          {
            folderId,
            title: videoTitle,
            type: "VIDEO",
            url: youtubeUrl,
          }
        );

        // Navigate directly to resource page
        router.push(`/resource/${resourceResponse.data.resource.id}`);
      } catch (error: any) {
        console.error("Error processing YouTube URL:", error);
        toast.error(
          error?.response?.data?.message || "Failed to process YouTube URL"
        );
        setIsProcessing(false);
      }
    } else {
      // Store YouTube URL in localStorage for AuthGate to handle after sign-in/onboarding
      localStorage.setItem("pendingYoutubeUrl", youtubeUrl);
      // Redirect to sign-in page
      router.push("/sign-in");
    }
  };

  return (
    <form
      onSubmit={handleGetStarted}
      className="z-20 w-full max-w-3xl mx-auto px-4"
    >
      <div
        className={`
          flex items-stretch overflow-hidden 
          bg-zinc-900/80 backdrop-blur-sm
          border-2 transition-all duration-300
          rounded-full
          ${
            isFocused
              ? "border-[#adff2f] shadow-lg shadow-[#adff2f]/20"
              : "border-zinc-700 hover:border-zinc-600"
          }
        `}
      >
        <input
          ref={inputRef}
          type="url"
          placeholder="Paste your YouTube video link here..."
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="
            flex-1 
            px-6 py-4
            bg-transparent 
            text-white text-base
            placeholder:text-zinc-500
            outline-none
            min-w-0
          "
        />
        <button
          type="submit"
          disabled={isProcessing}
          className="
            group
            relative
            px-8 py-4
            bg-gradient-to-r from-[#adff2f] to-[#9dff07]
            hover:from-[#9dff07] hover:to-[#adff2f]
            text-black font-semibold
            transition-all duration-300
            hover:shadow-xl hover:shadow-[#adff2f]/30
            flex items-center gap-2
            overflow-hidden
            whitespace-nowrap
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <span className="relative z-10 flex items-center gap-2">
            {isProcessing ? "Processing..." : "Get Started"}
            {!isProcessing && (
              <ArrowRightIcon className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#9dff07] to-[#adff2f] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </form>
  );
};

export default HeroForm;
