"use client";

import { use, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Wand2,
  BrainCircuit,
  FileQuestion,
  Route,
  ExternalLink,
  Brain,
} from "lucide-react";
import axios from "axios";
import Mermaid from "@/components/mermaid/mermaid";
import ReactMarkdown from "react-markdown";
import prepareMermaidCode from "@/lib/prepareMermaidCode";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import AddResourceForm from "@/components/AddResourceForm";

interface ResourceResponse {
  resource?: {
    id: string;
    title: string;
    url: string;
    summary: string;
    type: string;
    folderId?: string;
  };
}

type AIResponse =
  | { summary: string }
  | { mindmap: string }
  | { answer: string };

export default function ResourcePage({ params }: { params: any }) {
  const rawId = (use(params) as { id: string | string[] }).id;
  const resourceId = Array.isArray(rawId) ? rawId[0] : rawId;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingYoutubeUrl, setIsProcessingYoutubeUrl] = useState(false);
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [resourceSummary, setResourceSummary] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string; type: string; id?: string }[]
  >([]);
  const [input, setInput] = useState("");
  const lastProcessedUrlRef = useRef<string | null>(null);

  // Handle pending YouTube URL when no resourceId is present
  useEffect(() => {
    const handlePendingYoutubeUrl = async () => {
      if (resourceId) return; // Only process if no resourceId

      const pendingUrl = localStorage.getItem("pendingYoutubeUrl");
      if (!pendingUrl) {
        setIsLoading(false);
        return;
      }

      // Skip if we've already processed this exact URL
      if (lastProcessedUrlRef.current === pendingUrl) return;

      // Mark as processing to prevent multiple calls for the same URL
      lastProcessedUrlRef.current = pendingUrl;
      setIsProcessingYoutubeUrl(true);

      try {
        // Validate YouTube URL
        const videoIdMatch = pendingUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
        if (!videoIdMatch) {
          toast.error("Invalid YouTube URL");
          localStorage.removeItem("pendingYoutubeUrl");
          lastProcessedUrlRef.current = null;
          setIsProcessingYoutubeUrl(false);
          setIsLoading(false);
          return;
        }

        // Get or create "My Resources" folder
        const folderResponse = await axios.get<{ folder: { id: string } }>(
          "/api/folder/default"
        );
        const folderId = folderResponse.data.folder.id;

        // Get video title from YouTube API
        const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        if (!API_KEY) {
          toast.error("YouTube API key is missing");
          localStorage.removeItem("pendingYoutubeUrl");
          lastProcessedUrlRef.current = null;
          setIsProcessingYoutubeUrl(false);
          setIsLoading(false);
          return;
        }

        const videoId = videoIdMatch[1];
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`;
        const res = await fetch(apiUrl);
        const data = await res.json();
        const videoTitle = data.items?.[0]?.snippet?.title;

        if (!videoTitle) {
          toast.error("Failed to fetch video title");
          localStorage.removeItem("pendingYoutubeUrl");
          lastProcessedUrlRef.current = null;
          setIsProcessingYoutubeUrl(false);
          setIsLoading(false);
          return;
        }

        // Create resource
        const resourceResponse = await axios.post<{ resource: { id: string } }>(
          "/api/resource",
          {
            folderId,
            title: videoTitle,
            type: "VIDEO",
            url: pendingUrl,
          }
        );

        // Clear localStorage
        localStorage.removeItem("pendingYoutubeUrl");
        lastProcessedUrlRef.current = null;

        // Navigate to resource page with ID
        router.push(`/resource/${resourceResponse.data.resource.id}`);
      } catch (error: any) {
        console.error("Error processing YouTube URL:", error);
        toast.error(
          error?.response?.data?.message || "Failed to process YouTube URL"
        );
        localStorage.removeItem("pendingYoutubeUrl");
        // Reset ref on error so user can try again
        lastProcessedUrlRef.current = null;
        setIsProcessingYoutubeUrl(false);
        setIsLoading(false);
      }
    };

    handlePendingYoutubeUrl();
  }, [resourceId]);

  // Load resource when resourceId changes
  useEffect(() => {
    const loadResource = async () => {
      if (!resourceId) {
        return;
      }

      setIsLoading(true);
      try {
        const res = await axios.get<ResourceResponse>("/api/resource", {
          params: { id: resourceId },
        });
        if (res.data.resource) {
          setResourceTitle(res.data.resource.title);
          setResourceUrl(res.data.resource.url);
          setResourceSummary(res.data.resource.summary);
        }
      } catch (error) {
        console.error("Error loading resource:", error);
        toast.error("Failed to load resource");
      } finally {
        setIsLoading(false);
      }
    };

    loadResource();
  }, [resourceId]);

  const handleSend = async (
    customInput?: string,
    task: "summary" | "mindmap" | "roadmap" | "qa" = "qa"
  ) => {
    if (!resourceId) return;

    const userMessage = customInput ?? input.trim();
    if (!userMessage && task === "qa") return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage || `Generate ${task}`,
        type: "text",
      },
    ]);
    setInput("");

    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "🧠 Smriti AI is thinking...", type: "text" },
    ]);

    // Check if task is 'summary' and we already have it
    if (task === "summary" && resourceSummary) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          sender: "bot",
          text: resourceSummary,
          type: task,
        },
      ]);
      return;
    }

    try {
      const payload: any = {
        resourceId,
        task,
      };

      if (task === "qa") {
        payload.question = userMessage;
      }

      const res = await axios.post<AIResponse>("/api/resource/ai", payload);

      let botText = "";

      if ("summary" in res.data) {
        botText = res.data.summary;
      } else if ("mindmap" in res.data) {
        botText = res.data.mindmap;
      } else if ("answer" in res.data) {
        botText = res.data.answer;
      }

      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          sender: "bot",
          text: botText,
          type: task,
          id: task === "mindmap" ? crypto.randomUUID() : undefined,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          sender: "bot",
          text: "❌ Something went wrong while processing your request.",
          type: "text",
        },
      ]);
    }
  };

  const getSummary = () => handleSend("summarise this", "summary");
  const getMindMap = () => handleSend("Generate a mindmap", "mindmap");
  const getRoadMap = () => handleSend("Generate a Road Map", "roadmap");

  // Show loading state while processing YouTube URL
  if (isProcessingYoutubeUrl) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Processing your YouTube video...</p>
        </div>
      </div>
    );
  }

  if (!resourceId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-5 px-6 w-full max-w-7xl mx-auto min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-3xl">
          {/* Decorative background elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          </div>

          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20 mb-6 shadow-lg shadow-primary/10 backdrop-blur-sm">
              <Brain className="h-12 w-12 text-primary" />
            </div>

            <h2 className="text-4xl font-bold mb-4 bg-linear-to-r from-white to-zinc-300 bg-clip-text text-transparent">
              Add Your Resource
            </h2>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              {[
                { icon: "🎥", label: "Video Analysis" },
                { icon: "📝", label: "Smart Summaries" },
                { icon: "🧠", label: "Mind Maps" },
                { icon: "✨", label: "AI Flashcards" },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/60 border border-zinc-700/50 text-zinc-300 text-sm backdrop-blur-sm"
                >
                  <span>{feature.icon}</span>
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Section */}
          <AddResourceForm />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Resource chat interface */}
      <div className="flex-1 flex flex-col pt-5 w-full h-full min-h-0">
        {/* Header - Only show when there are messages */}
        {messages.length > 0 && (
          <div className="px-6 shrink-0">
            <div className="max-w-7xl mx-auto">
              {isLoading ? (
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="h-8 w-96 bg-zinc-800" />
                  <Skeleton className="h-5 w-5 bg-zinc-800" />
                </div>
              ) : (
                <a
                  href={resourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center gap-2 text-white text-lg hover:text-primary transition-colors mb-4"
                >
                  <h1 className="text-3xl font-bold">{resourceTitle}</h1>
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto min-h-0 w-full">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="max-w-7xl mx-auto px-6 w-full">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Skeleton className="h-12 w-[500px] bg-zinc-800" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <a
                      href={resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-white hover:text-primary transition-colors"
                    >
                      <h2 className="text-lg md:text-4xl font-bold">
                        {resourceTitle}
                      </h2>
                      <ExternalLink className="h-6 w-6" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex w-full ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  } animate-in fade-in slide-in-from-bottom-4 duration-500`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div
                    className={`
                      ${
                        msg.sender === "user"
                          ? "bg-zinc-800 text-foreground max-w-xs"
                          : "text-foreground w-full"
                      }
                      p-4 rounded-xl shadow prose prose-invert
                      ${
                        msg.sender === "user"
                          ? "rounded-br-none"
                          : "rounded-bl-none"
                      }
                      leading-loose
                    `}
                  >
                    {msg.sender === "bot" && msg.type === "mindmap" ? (
                      <Mermaid
                        id={msg.id || `mermaid-${idx}`}
                        chart={prepareMermaidCode({ code: msg.text })}
                        key={msg.id || `mermaid-${idx}`}
                      />
                    ) : (
                      <div
                        className={`max-w-none ${
                          msg.sender === "bot" ? "markdown-body" : ""
                        }`}
                      >
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input & Actions */}
        <div className="max-w-7xl mx-auto w-full border-t border-muted bg-zinc-800 p-4 shadow-inner rounded-t-3xl shrink-0">
          {/* Input Row */}
          <div className="flex gap-2 mb-4 items-end">
            <Textarea
              ref={textareaRef}
              className="flex-1 resize-none min-h-5 max-h-40 overflow-auto rounded-2xl text-white placeholder:text-zinc-400 focus-visible:ring-1 focus:ring-primary border-zinc-700 bg-zinc-800"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              size="icon"
              className="rounded-full bg-primary hover:bg-primary-dark text-black hover:scale-105 transition"
              onClick={() => handleSend(input)}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-5 gap-2">
            <Button
              variant="outline"
              className="rounded-full border-zinc-700 text-white hover:bg-zinc-800"
              onClick={getSummary}
            >
              <Wand2 className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">AI Summarize</span>
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-zinc-700 text-white hover:bg-zinc-800"
              onClick={getMindMap}
            >
              <BrainCircuit className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Mind Map</span>
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-zinc-700 text-white hover:bg-zinc-800"
              onClick={getRoadMap}
            >
              <Route className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Road Map</span>
            </Button>
            {resourceId && (
              <>
                <Button
                  variant="outline"
                  className="rounded-full border-zinc-700 text-white hover:bg-zinc-800"
                  onClick={() => router.push(`/resource/${resourceId}/quiz`)}
                >
                  <FileQuestion className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Quiz</span>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-zinc-700 text-white hover:bg-zinc-800"
                  onClick={() =>
                    router.push(`/resource/${resourceId}/flashcard`)
                  }
                >
                  <Brain className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Flashcards</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
