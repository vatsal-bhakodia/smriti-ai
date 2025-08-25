"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, Eye, Check, X } from "lucide-react";

interface FlashcardProps {
  id: string;
  term: string;
  definition: string;
  onDifficultyRate: (difficulty: number) => void;
  isReview?: boolean;
}

export default function Flashcard({
  id,
  term,
  definition,
  onDifficultyRate,
  isReview = false,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(false);

  const handleFlip = useCallback(() => {
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  const handleDifficultyRate = (difficulty: number) => {
    onDifficultyRate(difficulty);
    setShowDifficulty(false);
    setIsFlipped(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showDifficulty) {
        // Handle difficulty rating with number keys
        if (event.key >= '1' && event.key <= '5') {
          event.preventDefault();
          handleDifficultyRate(parseInt(event.key));
        }
        return;
      }

      switch (event.key) {
        case ' ':
        case 'Enter':
          event.preventDefault();
          if (!isFlipped) {
            handleFlip();
          } else {
            setShowDifficulty(true);
          }
          break;
        case 'f':
        case 'F':
          event.preventDefault();
          handleFlip();
          break;
        case 'Escape':
          if (showDifficulty) {
            event.preventDefault();
            setShowDifficulty(false);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, showDifficulty, handleFlip]);

  const cardId = `flashcard-${id}`;
  const termId = `${cardId}-term`;
  const definitionId = `${cardId}-definition`;

  return (
    <div className="w-full max-w-md mx-auto" role="region" aria-label="Flashcard">
      <div className="flashcard-container h-64">
        <Card 
          className={`flashcard h-full cursor-pointer transition-transform duration-300 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${isFlipped ? "flipped" : ""}`} 
          onClick={handleFlip}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleFlip();
            }
          }}
          tabIndex={0}
          role="button"
          aria-pressed={isFlipped}
          aria-describedby={isFlipped ? definitionId : `${termId}-instruction`}
          aria-label={isFlipped ? `Definition: ${definition}` : `Term: ${term}. Press Enter or Space to reveal definition`}
        >
          <div className="flashcard-front">
            <CardContent className="p-6 flex flex-col justify-center items-center text-center">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground" aria-hidden="true">Term</div>
                <h3 id={termId} className="text-xl font-semibold">{term}</h3>
                <div id={`${termId}-instruction`} className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" aria-hidden="true" />
                  <span>Press Enter or Space to reveal definition</span>
                </div>
              </div>
            </CardContent>
          </div>
          <div className="flashcard-back">
            <CardContent className="p-6 flex flex-col justify-center items-center text-center">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground" aria-hidden="true">Definition</div>
                <p id={definitionId} className="text-lg">{definition}</p>
                {isReview && !showDifficulty && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDifficulty(true);
                    }}
                    className="mt-4"
                    aria-label="Rate difficulty of this flashcard"
                  >
                    Rate Difficulty
                  </Button>
                )}
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {showDifficulty && (
        <div className="mt-6 space-y-4" role="dialog" aria-labelledby="difficulty-title" aria-describedby="difficulty-instructions">
          <h4 id="difficulty-title" className="text-center font-medium">
            How difficult was this card?
          </h4>
          <fieldset className="flex justify-center space-x-2">
            <legend className="sr-only">Rate flashcard difficulty from 1 (easy) to 5 (hard)</legend>
            {[1, 2, 3, 4, 5].map((difficulty) => {
              const difficultyLabel = difficulty <= 2 ? "Easy" : difficulty <= 4 ? "Medium" : "Hard";
              return (
                <Button
                  key={difficulty}
                  variant={difficulty <= 2 ? "default" : difficulty <= 4 ? "secondary" : "destructive"}
                  size="sm"
                  onClick={() => handleDifficultyRate(difficulty)}
                  className="flex items-center space-x-1"
                  aria-label={`Rate as ${difficulty} - ${difficultyLabel}`}
                >
                  {difficulty <= 2 ? (
                    <Check className="w-4 h-4" aria-hidden="true" />
                  ) : difficulty >= 4 ? (
                    <X className="w-4 h-4" aria-hidden="true" />
                  ) : null}
                  <span>{difficulty}</span>
                </Button>
              );
            })}
          </fieldset>
          <div id="difficulty-instructions" className="text-center text-sm text-muted-foreground">
            1 = Easy, 5 = Hard. Use number keys 1-5 or click buttons.
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleFlip}
          className="flex items-center space-x-2"
          aria-label={`Flip card to ${isFlipped ? 'show term' : 'show definition'}`}
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>Flip Card</span>
        </Button>
      </div>
    </div>
  );
}
