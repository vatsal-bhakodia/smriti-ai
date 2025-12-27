"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileVideo, FileText, Upload, X, Type } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

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

interface AddResourceFormProps {
  folderId?: string;
  onResourceCreated?: (resourceId: string) => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

export default function AddResourceForm({
  folderId,
  onResourceCreated,
  onCancel,
  showCancelButton = false,
}: AddResourceFormProps) {
  const router = useRouter();
  const [resourceType, setResourceType] = useState<"VIDEO" | "PDF" | "TEXT">("TEXT");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfTitle, setPdfTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [textTitle, setTextTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleCreateResource = async () => {
    // Prevent multiple submissions
    if (isCreating) {
      return;
    }

    // Fetch default folder if no folderId is provided
    let targetFolderId = folderId;

    if (!targetFolderId) {
      try {
        setIsCreating(true);
        const folderResponse = await axios.get<{ folder: { id: string } }>(
          "/api/folder/default"
        );
        targetFolderId = folderResponse.data.folder.id;
      } catch (error) {
        console.error("Error loading default folder:", error);
        toast.error("Failed to load default folder");
        setIsCreating(false);
        return;
      }
    }

    if (!targetFolderId) {
      toast.error("Folder ID is missing");
      setIsCreating(false);
      return;
    }

    try {
      setIsCreating(true);

      if (resourceType === "VIDEO") {
        const videoIdMatch = youtubeUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;

        if (!videoId) {
          toast.error("Please enter a valid YouTube URL");
          setIsCreating(false);
          return;
        }

        const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        if (!API_KEY) {
          toast.error("YouTube API key is missing");
          setIsCreating(false);
          return;
        }

        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`;
        const res = await fetch(apiUrl);
        const data = await res.json();
        const videoTitle = data.items?.[0]?.snippet?.title;

        if (!videoTitle) {
          toast.error("Failed to fetch video title");
          setIsCreating(false);
          return;
        }

        const response = await axios.post<ResourceResponse>("/api/resource", {
          folderId: targetFolderId,
          title: videoTitle,
          type: "VIDEO",
          url: youtubeUrl,
        });

        if (response.data.resource) {
          toast.success("Resource created successfully");
          // Reset form
          setYoutubeUrl("");
          setPdfFile(null);
          setPdfTitle("");
          setResourceType("VIDEO");

          if (onResourceCreated) {
            onResourceCreated(response.data.resource.id);
          } else {
            router.push(`/resource/${response.data.resource.id}`);
          }
        }
      } else if (resourceType === "PDF" && pdfFile) {
        if (!pdfTitle.trim()) {
          toast.error("Please enter a PDF title");
          setIsCreating(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", pdfFile);
        formData.append("type", "PDF");
        formData.append("title", pdfTitle);
        formData.append("folderId", targetFolderId);

        const response = await axios.post<ResourceResponse>(
          "/api/resource",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.data.resource) {
          toast.success("Resource created successfully");
          // Reset form
          setYoutubeUrl("");
          setPdfFile(null);
          setPdfTitle("");
          setResourceType("TEXT");

          if (onResourceCreated) {
            onResourceCreated(response.data.resource.id);
          } else {
            router.push(`/resource/${response.data.resource.id}`);
          }
        }
      } else if (resourceType === "TEXT") {
        if (!textContent.trim()) {
          toast.error("Please enter some text content");
          setIsCreating(false);
          return;
        }

        // Use text content as title if title is empty, or use first line
        const title = textTitle.trim() || textContent.substring(0, 100).split("\n")[0] || "Text Content";

        const response = await axios.post<ResourceResponse>("/api/resource", {
          folderId: targetFolderId,
          title: title,
          type: "TEXT",
          url: "text://content",
          summary: textContent,
        });

        if (response.data.resource) {
          toast.success("Resource created successfully");
          // Reset form
          setTextContent("");
          setTextTitle("");
          setYoutubeUrl("");
          setPdfFile(null);
          setPdfTitle("");
          setResourceType("TEXT");

          if (onResourceCreated) {
            onResourceCreated(response.data.resource.id);
          } else {
            router.push(`/resource/${response.data.resource.id}`);
          }
        }
      }
    } catch (error: any) {
      console.error("Error creating resource:", error);
      toast.error(
        error?.response?.data?.message || "Failed to create resource"
      );
    } finally {
      setIsCreating(false);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find((file) => file.type === "application/pdf");

    if (pdfFile) {
      setPdfFile(pdfFile);
      if (!pdfTitle) {
        setPdfTitle(pdfFile.name.replace(".pdf", ""));
      }
    } else {
      toast.error("Please drop a PDF file");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdfFile(file);
      if (!pdfTitle) {
        setPdfTitle(file.name.replace(".pdf", ""));
      }
    }
  };

  const handleRemoveFile = () => {
    setPdfFile(null);
  };

  const handleReset = () => {
    setYoutubeUrl("");
    setPdfFile(null);
    setPdfTitle("");
    setTextContent("");
    setTextTitle("");
    setResourceType("TEXT");
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-linear-to-br from-zinc-900 via-zinc-900 to-zinc-950 rounded-2xl px-6 py-4 mb-8 border border-zinc-800/60 shadow-2xl shadow-black/40 backdrop-blur-sm">
      {/* Header with Resource Type Selector */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 p-1 bg-zinc-800/50 rounded-lg border border-zinc-700/50 w-fit">
          {[
            {
              type: "TEXT" as const,
              icon: Type,
              label: "Text",
            },
            {
              type: "VIDEO" as const,
              icon: FileVideo,
              label: "YouTube Video",
            },
            { type: "PDF" as const, icon: FileText, label: "PDF File" },
          ].map((item, index) => {
            const Icon = item.icon;
            const isSelected = resourceType === item.type;
            return (
              <div key={item.type} className="flex items-center">
                {index > 0 && (
                  <div className="w-px h-4 bg-zinc-700/50 mr-2"></div>
                )}
                <Label className="flex items-center gap-2 cursor-pointer group px-2.5 py-1 rounded-md transition-all hover:bg-zinc-700/30">
                  <input
                    type="radio"
                    name="resourceType"
                    checked={isSelected}
                    onChange={() => setResourceType(item.type)}
                    className="sr-only peer"
                  />
                  <div
                    className={`flex items-center gap-1.5 ${
                      isSelected ? "scale-105" : ""
                    } transition-transform`}
                  >
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        isSelected ? "text-primary" : "text-zinc-400"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium transition-colors ${
                        isSelected ? "text-primary" : "text-zinc-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                </Label>
              </div>
            );
          })}
        </div>
        {showCancelButton && onCancel && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Content Area */}
      <div className="space-y-4">
        {resourceType === "TEXT" ? (
          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <Label
                htmlFor="text-title"
                className="text-sm font-medium text-zinc-300 mb-2 block"
              >
                Title (Optional)
              </Label>
              <Input
                id="text-title"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                placeholder="Enter a title (or leave empty to use first line of text)"
                className="bg-zinc-800/60 border-zinc-700/60 text-white placeholder:text-zinc-500 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all h-12 rounded-xl"
              />
            </div>

            {/* Text Content */}
            <div>
              <Label
                htmlFor="text-content"
                className="text-sm font-medium text-zinc-300 mb-2 block"
              >
                Text Content
              </Label>
              <textarea
                id="text-content"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Paste your text here... (can be a long paragraph or just a topic name)"
                className="w-full min-h-[200px] bg-zinc-800/60 border border-zinc-700/60 text-white placeholder:text-zinc-500 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all rounded-xl p-4 resize-y"
              />
            </div>

            <Button
              onClick={handleCreateResource}
              disabled={!textContent.trim() || isCreating}
              className="w-full bg-primary text-black hover:bg-primary-dark font-semibold h-12 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-xl hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isCreating ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Creating Resource...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Create Resource
                </span>
              )}
            </Button>
          </div>
        ) : resourceType === "VIDEO" ? (
          <div className="space-y-4">
            <div className="relative">
              <Input
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Enter YouTube URL (e.g., https://youtube.com/watch?v=...)"
                className="bg-zinc-800/60 border-zinc-700/60 text-white placeholder:text-zinc-500 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all h-12 pl-4 pr-4 rounded-xl"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && youtubeUrl && !isCreating) {
                    handleCreateResource();
                  }
                }}
              />
            </div>
            <Button
              onClick={handleCreateResource}
              disabled={!youtubeUrl || isCreating}
              className="w-full bg-primary text-black hover:bg-primary-dark font-semibold h-12 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-xl hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isCreating ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Adding Video...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Add Video
                </span>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <Label
                htmlFor="pdf-title"
                className="text-sm font-medium text-zinc-300 mb-2 block"
              >
                PDF Title
              </Label>
              <Input
                id="pdf-title"
                value={pdfTitle}
                onChange={(e) => setPdfTitle(e.target.value)}
                placeholder="Enter a title for your PDF"
                className="bg-zinc-800/60 border-zinc-700/60 text-white placeholder:text-zinc-500 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all h-12 rounded-xl"
              />
            </div>

            {/* Drag and Drop Zone */}
            <div>
              <Label className="text-sm font-medium text-zinc-300 mb-2 block">
                Upload File
              </Label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
                  isDragging
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : pdfFile
                    ? "border-primary/50 bg-zinc-800/40"
                    : "border-zinc-700/60 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800/50"
                }`}
              >
                {pdfFile ? (
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm truncate max-w-[300px]">
                          {pdfFile.name}
                        </p>
                        <p className="text-zinc-400 text-xs mt-1">
                          {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveFile}
                      className="text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-colors rounded-lg"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="pdf-file-input"
                    className="cursor-pointer block p-8 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-zinc-800/60 rounded-xl border border-zinc-700/50">
                        <Upload className="h-8 w-8 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium mb-1">
                          Drop your PDF here or{" "}
                          <span className="text-primary hover:text-primary-dark transition-colors">
                            browse
                          </span>
                        </p>
                        <p className="text-zinc-500 text-xs">
                          Maximum file size: 50MB
                        </p>
                      </div>
                    </div>
                    <input
                      id="pdf-file-input"
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileSelect}
                      className="sr-only"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleCreateResource}
              disabled={!pdfTitle || !pdfFile || isCreating}
              className="w-full bg-primary text-black hover:bg-primary-dark font-semibold h-12 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-xl hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isCreating ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Uploading PDF...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload PDF
                </span>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
