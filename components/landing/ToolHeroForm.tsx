"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSafeClerk } from "@/hooks/useSafeClerk";
import { ArrowRightIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ToolHeroFormProps {
  toolType: "flashcard" | "mindmap" | "quiz";
  defaultInputType?: "youtube" | "text" | "pdf";
}

const ToolHeroForm = ({
  toolType,
  defaultInputType = "youtube",
}: ToolHeroFormProps) => {
  const [inputType, setInputType] = useState<"youtube" | "text" | "pdf">(
    defaultInputType
  );
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [textContent, setTextContent] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, isLoaded, user } = useSafeClerk();

  // Get the base path for navigation (e.g., youtube-to-flashcards, pdf-to-flashcards)
  const getPathForInputType = (type: "youtube" | "text" | "pdf") => {
    // Extract tool type from current path - try to match the full pattern first
    const fullMatch = pathname.match(
      /\/(?:youtube|pdf|text)-to-(flashcards?|mindmaps?|quiz)/
    );
    if (fullMatch) {
      const toolPath = fullMatch[1]; // e.g., "flashcards", "flashcard", "mindmaps", etc.
      return `/${type}-to-${toolPath}`;
    }

    // Fallback: try to match just the tool type (for old routes like /flashcard)
    const toolMatch = pathname.match(/\/(flashcard|mindmap|quiz)/);
    const currentTool = toolMatch?.[0]?.replace("/", "") || toolType;

    // Map tool types to URL format (plural forms for new routes)
    const toolPathMap: Record<string, string> = {
      flashcard: "flashcards",
      mindmap: "mindmaps",
      quiz: "quiz",
    };

    return `/${type}-to-${toolPathMap[currentTool] || toolPathMap[toolType]}`;
  };

  // Auto-focus input on mount
  useEffect(() => {
    if (inputType === "youtube" && inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    } else if (inputType === "text" && textareaRef.current) {
      textareaRef.current.focus();
      setIsFocused(true);
    }
  }, [inputType]);

  // Update URL when input type changes (without page reload)
  const handleTabChange = (value: string) => {
    const newType = value as "youtube" | "text" | "pdf";
    setInputType(newType);
    const newPath = getPathForInputType(newType);
    router.push("/tools/" + newPath, { scroll: false });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please select a PDF file");
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File size must be less than 50MB");
        return;
      }
      setPdfFile(file);
    }
  };

  const handleGetStarted = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputType === "youtube") {
      if (!youtubeUrl.trim()) {
        toast.error("Please enter a YouTube URL");
        return;
      }

      const videoIdMatch = youtubeUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
      if (!videoIdMatch) {
        toast.error("Please enter a valid YouTube URL");
        return;
      }
    } else if (inputType === "text") {
      if (!textContent.trim()) {
        toast.error("Please enter some text content");
        return;
      }
    } else if (inputType === "pdf") {
      if (!pdfFile) {
        toast.error("Please select a PDF file");
        return;
      }
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

        if (inputType === "youtube") {
          const videoIdMatch = youtubeUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
          const videoId = videoIdMatch![1];

          const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
          if (!API_KEY) {
            toast.error("YouTube API key is missing");
            setIsProcessing(false);
            return;
          }

          const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`;
          const res = await fetch(apiUrl);
          const data = await res.json();
          const videoTitle = data.items?.[0]?.snippet?.title;

          if (!videoTitle) {
            toast.error("Failed to fetch video title");
            setIsProcessing(false);
            return;
          }

          const resourceResponse = await axios.post<{
            resource: { id: string };
          }>("/api/resource", {
            folderId,
            title: videoTitle,
            type: "VIDEO",
            url: youtubeUrl,
          });

          router.push(`/resource/${resourceResponse.data.resource.id}`);
        } else if (inputType === "text") {
          // Create TEXT resource for text content
          // Store text in summary field, use placeholder URL
          const title =
            textContent.substring(0, 100).split("\n")[0] || "Text Content";
          const resourceResponse = await axios.post<{
            resource: { id: string };
          }>("/api/resource", {
            folderId,
            title: title,
            type: "TEXT",
            url: "text://content",
            summary: textContent,
          });

          router.push(`/resource/${resourceResponse.data.resource.id}`);
        } else if (inputType === "pdf" && pdfFile) {
          // Create PDF resource
          const formData = new FormData();
          formData.append("file", pdfFile);
          formData.append("type", "PDF");
          formData.append("title", pdfFile.name.replace(/\.pdf$/, ""));
          formData.append("folderId", folderId);

          const resourceResponse = await axios.post<{
            resource: { id: string };
          }>("/api/resource", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          router.push(`/resource/${resourceResponse.data.resource.id}`);
        }
      } catch (error: any) {
        console.error("Error processing input:", error);
        toast.error(
          error?.response?.data?.message || "Failed to process input"
        );
        setIsProcessing(false);
      }
    } else {
      // Store input in localStorage for AuthGate to handle after sign-in/onboarding
      if (inputType === "youtube") {
        localStorage.setItem("pendingYoutubeUrl", youtubeUrl);
      } else if (inputType === "text") {
        localStorage.setItem("pendingTextContent", textContent);
      } else if (inputType === "pdf" && pdfFile) {
        // Store file name for now, actual file handling will need to be done after auth
        localStorage.setItem("pendingPdfFileName", pdfFile.name);
      }
      router.push("/sign-in");
    }
  };

  return (
    <div className="z-20 w-full max-w-3xl mx-auto px-4">
      <Tabs
        value={inputType}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-4 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-full p-1">
          <TabsTrigger
            value="youtube"
            className="data-[state=active]:bg-primary data-[state=active]:text-black rounded-full"
          >
            YouTube
          </TabsTrigger>
          <TabsTrigger
            value="text"
            className="data-[state=active]:bg-primary data-[state=active]:text-black rounded-full"
          >
            Text
          </TabsTrigger>
          <TabsTrigger
            value="pdf"
            className="data-[state=active]:bg-primary data-[state=active]:text-black rounded-full"
          >
            PDF
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleGetStarted}>
          <TabsContent value="youtube" className="mt-0">
            <div
              className={`
                flex items-stretch overflow-hidden 
                bg-zinc-900/80 backdrop-blur-sm
                border-2 transition-all duration-300
                rounded-full
                ${
                  isFocused
                    ? "border-primary shadow-lg shadow-primary/20"
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
                  bg-linear-to-r from-primary to-primary-dark
                  hover:from-primary-dark hover:to-primary
                  text-black font-semibold
                  transition-all duration-300
                  hover:shadow-xl hover:shadow-primary/30
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
                <div className="absolute inset-0 bg-linear-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </TabsContent>

          <TabsContent value="text" className="mt-0">
            <div
              className={`
                flex flex-col overflow-hidden 
                bg-zinc-900/80 backdrop-blur-sm
                border-2 transition-all duration-300
                rounded-2xl
                ${
                  isFocused
                    ? "border-primary shadow-lg shadow-primary/20"
                    : "border-zinc-700 hover:border-zinc-600"
                }
              `}
            >
              <textarea
                ref={textareaRef}
                placeholder="Paste or type your text content here..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                rows={6}
                className="
                  flex-1 
                  px-6 py-4
                  bg-transparent 
                  text-white text-base
                  placeholder:text-zinc-500
                  outline-none
                  resize-none
                  min-w-0
                "
              />
              <button
                type="submit"
                disabled={isProcessing}
                className="
                  group
                  relative
                  px-8 py-4 m-4
                  bg-linear-to-r from-primary to-primary-dark
                  hover:from-primary-dark hover:to-primary
                  text-black font-semibold
                  transition-all duration-300
                  hover:shadow-xl hover:shadow-primary/30
                  flex items-center justify-center gap-2
                  overflow-hidden
                  whitespace-nowrap
                  disabled:opacity-50 disabled:cursor-not-allowed
                  rounded-full
                "
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isProcessing ? "Processing..." : "Get Started"}
                  {!isProcessing && (
                    <ArrowRightIcon className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                  )}
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </TabsContent>

          <TabsContent value="pdf" className="mt-0">
            <div
              className={`
                flex flex-col overflow-hidden 
                bg-zinc-900/80 backdrop-blur-sm
                border-2 transition-all duration-300
                rounded-2xl
                ${
                  isFocused || pdfFile
                    ? "border-primary shadow-lg shadow-primary/20"
                    : "border-zinc-700 hover:border-zinc-600"
                }
              `}
            >
              {pdfFile ? (
                <div className="px-6 py-4 flex items-center justify-between">
                  <span className="text-white text-base">{pdfFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setPdfFile(null)}
                    className="text-zinc-500 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="pdf-upload"
                  className="px-6 py-12 cursor-pointer text-center"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-zinc-800/60 rounded-xl border border-zinc-700/50">
                      <svg
                        className="h-8 w-8 text-zinc-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <p className="text-white font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-zinc-500 text-sm">
                      PDF file (max. 50MB)
                    </p>
                  </div>
                </label>
              )}
              <input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="sr-only"
              />
              {pdfFile && (
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="
                    group
                    relative
                    px-8 py-4 m-4
                    bg-linear-to-r from-primary to-primary-dark
                    hover:from-primary-dark hover:to-primary
                    text-black font-semibold
                    transition-all duration-300
                    hover:shadow-xl hover:shadow-primary/30
                    flex items-center justify-center gap-2
                    overflow-hidden
                    whitespace-nowrap
                    disabled:opacity-50 disabled:cursor-not-allowed
                    rounded-full
                  "
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isProcessing ? "Processing..." : "Get Started"}
                    {!isProcessing && (
                      <ArrowRightIcon className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                    )}
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )}
            </div>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
};

export default ToolHeroForm;
