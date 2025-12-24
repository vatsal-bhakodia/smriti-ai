"use client";

import { use, useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Download,
  Brain,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

interface FlashcardData {
  id: string;
  term: string;
  definition: string;
}

interface FlashcardDeckData {
  id: string;
  title: string;
  cards: FlashcardData[];
}

export default function FlashcardPage({ params }: { params: any }) {
  const rawId = (use(params) as { id: string | string[] }).id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [resourceTitle, setResourceTitle] = useState("");
  const [flashcardDeck, setFlashcardDeck] = useState<FlashcardDeckData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function fetchData() {
      try {
        // Fetch resource title
        const res = await axios.get<{ resource?: { title: string } }>(
          `/api/resource`,
          {
            params: { id },
          }
        );

        if (res.data.resource) {
          setResourceTitle(res.data.resource.title);
        }

        // Check if flashcard deck already exists
        const payload = {
          resourceId: id,
          task: "flashcards",
        };

        const resFlashcards = await axios.post("/api/resource-ai", payload);

        if (
          resFlashcards.data &&
          typeof resFlashcards.data === "object" &&
          "deck" in resFlashcards.data &&
          "cards" in resFlashcards.data
        ) {
          const data = resFlashcards.data as { deck: any; cards: any[] };
          setFlashcardDeck({
            id: data.deck.id,
            title: data.deck.title,
            cards: data.cards.map((card: any) => ({
              id: card.id,
              term: card.term,
              definition: card.definition,
            })),
          });
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 404) {
          setError("Flashcard deck not found. Generate flashcards first.");
        } else {
          setError("Failed to load flashcards. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const generateFlashcards = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const payload = {
        resourceId: id,
        task: "flashcards",
      };

      const res = await axios.post("/api/resource-ai", payload);

      if (
        res.data &&
        typeof res.data === "object" &&
        "deck" in res.data &&
        "cards" in res.data
      ) {
        const data = res.data as { deck: any; cards: any[] };
        setFlashcardDeck({
          id: data.deck.id,
          title: data.deck.title,
          cards: data.cards.map((card: any) => ({
            id: card.id,
            term: card.term,
            definition: card.definition,
          })),
        });
      }
    } catch (error: any) {
      console.error("Error generating flashcards:", error);
      setError("Failed to generate flashcards. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format: "txt" | "anki" = "txt") => {
    setIsExporting(true);
    try {
      const response = await axios.get(`/api/flashcard-export`, {
        params: {
          resourceId: id,
          format,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data as BlobPart])
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        response.headers["content-disposition"]
          ?.split("filename=")[1]
          ?.replace(/"/g, "") || `flashcards.${format}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting flashcards:", error);
      setError("Failed to export flashcards. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleNext = () => {
    if (flashcardDeck && currentIndex < flashcardDeck.cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const currentCard = flashcardDeck?.cards[currentIndex];
  const progress = flashcardDeck
    ? ((currentIndex + 1) / flashcardDeck.cards.length) * 100
    : 0;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!flashcardDeck) return;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          handlePrevious();
          break;
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          handleNext();
          break;
        case " ":
        case "Enter":
          e.preventDefault();
          toggleFlip();
          break;
        case "r":
        case "R":
          e.preventDefault();
          handleReset();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flashcardDeck, currentIndex, isFlipped]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Progress Skeleton */}
        <div className="mb-8 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>

        {/* Card Deck Skeleton */}
        <div className="relative mx-auto max-w-2xl mb-8">
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>

        {/* Navigation Skeleton */}
        <div className="flex justify-center items-center space-x-4">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
    );
  }

  if (error && !flashcardDeck) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href={`/resource/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Flashcards</h1>
            <p className="text-muted-foreground mt-1">
              {resourceTitle || "Loading..."}
            </p>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto border-2">
          <CardContent className="p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-6">
                <Brain className="h-12 w-12 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">No Flashcards Yet</h2>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Button
              onClick={generateFlashcards}
              disabled={isGenerating}
              size="lg"
              className="mt-4"
            >
              {isGenerating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Generating Flashcards...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-5 w-5" />
                  Generate Flashcards
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href={`/resource/${id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Flashcards</h1>
            <p className="text-muted-foreground mt-1">
              {resourceTitle || "Loading..."}
            </p>
          </div>
        </div>

        {flashcardDeck && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={isExporting}>
                {isExporting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleExport("txt")}>
                Export as Text (.txt)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("anki")}>
                Export as CSV (Anki)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {flashcardDeck ? (
        <>
          {/* Progress Bar */}
          <div className="mb-8 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Card {currentIndex + 1} of {flashcardDeck.cards.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 3D Stacked Card Deck */}
          <div className="relative mx-auto max-w-2xl mb-8 perspective-1000">
            <div className="relative h-[400px] flex items-center justify-center">
              {/* Stack effect - showing 3 cards behind */}
              {[2, 1, 0].map((offset) => {
                const cardIndex = currentIndex + offset;
                if (cardIndex >= flashcardDeck.cards.length) return null;

                return (
                  <div
                    key={cardIndex}
                    className="absolute w-full transition-all duration-300 ease-out"
                    style={{
                      transform: `translateY(${offset * -8}px) translateZ(${
                        offset * -20
                      }px) scale(${1 - offset * 0.05})`,
                      opacity: offset === 0 ? 1 : 0.5 - offset * 0.15,
                      zIndex: 10 - offset,
                      filter: offset > 0 ? "blur(0.5px)" : "none",
                    }}
                  >
                    {offset === 0 && currentCard && (
                      <div
                        className="cursor-pointer w-full relative min-h-[400px]"
                        onClick={toggleFlip}
                        style={{
                          transformStyle: "preserve-3d",
                          transform: isFlipped
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                          transition:
                            "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        {/* Front of card */}
                        <Card
                          className="absolute inset-0 hover:shadow-2xl transition-all duration-300 border-2 backdrop-blur-sm bg-card/95"
                          style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                          }}
                        >
                          <CardContent className="p-8 md:p-12 h-[400px] flex items-center justify-center overflow-hidden">
                            <div className="text-center w-full max-w-xl mx-auto">
                              <div className="space-y-4 md:space-y-6">
                                <div className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                                  Term
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold wrap-break-word px-4">
                                  {currentCard.term}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                  Click to reveal definition
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Back of card */}
                        <Card
                          className="absolute inset-0 hover:shadow-2xl transition-all duration-300 border-2 backdrop-blur-sm bg-card/95"
                          style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          <CardContent className="p-8 md:p-12 h-[400px] flex items-center justify-center overflow-y-auto">
                            <div className="text-center w-full max-w-xl mx-auto">
                              <div className="space-y-4 md:space-y-6">
                                <div className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                                  Definition
                                </div>
                                <p className="text-lg md:text-xl leading-relaxed wrap-break-word px-4">
                                  {currentCard.definition}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Click to show term
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                    {offset > 0 && (
                      <Card className="border-2 pointer-events-none">
                        <CardContent className="p-12 min-h-[400px]" />
                      </Card>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center space-x-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="transition-all hover:scale-105"
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              Previous
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="transition-all hover:scale-110"
              title="Reset to first card"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleNext}
              disabled={currentIndex === flashcardDeck.cards.length - 1}
              className="transition-all hover:scale-105"
            >
              Next
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-sm font-medium text-foreground/80">
              Keyboard Shortcuts
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <KbdGroup>
                  <Kbd>←</Kbd>
                  <Kbd>→</Kbd>
                </KbdGroup>
                Navigate
              </span>
              <span className="flex items-center gap-2">
                <Kbd>Space</Kbd>
                Flip
              </span>
              <span className="flex items-center gap-2">
                <Kbd>R</Kbd>
                Reset
              </span>
            </div>
          </div>
        </>
      ) : (
        <Card className="max-w-2xl mx-auto border-2">
          <CardContent className="p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-6">
                <Brain className="h-12 w-12 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Generate Flashcards</h2>
              <p className="text-muted-foreground">
                Generate AI-powered flashcards from your resource content. This
                will create term-definition pairs based on key concepts.
              </p>
            </div>
            <Button
              onClick={generateFlashcards}
              disabled={isGenerating}
              size="lg"
              className="mt-4"
            >
              {isGenerating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Generating Flashcards...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-5 w-5" />
                  Generate Flashcards
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
