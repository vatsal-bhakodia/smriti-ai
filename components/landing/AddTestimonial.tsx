"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Rating } from "react-simple-star-rating";

interface Review {
  id: string;
  body: string;
  name: string;
  img: string;
  rating: number;
}

export default function AddTestimonial({ onReviewSubmit }: { onReviewSubmit: (newReview: Review) => void }) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!user) return;

    const checkForReview = async () => {
      setIsChecking(true);
      const supabase = createClient();
      const { count, error } = await supabase
        .from("testimonial")
        .select("id", { count: "exact", head: true })
        .eq("userId", user.id);

      if (error) {
        console.error("Error checking for existing review:", error);
      } else if (count && count > 0) {
        setHasSubmitted(true);
      }
      setIsChecking(false);
    };

    checkForReview();
  }, [user]);

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || reviewText.trim().length === 0 || rating == 0) return;

    setIsSubmitting(true);
    setError(null);
    const supabase = createClient();

    const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();

    const { data: newReview, error } = await supabase
      .from("testimonial")
      .insert({
        body: reviewText.trim(),
        userId: user.id,
        username: displayName || "SmritiAI User",
        rating: rating,
      })
      .select()
      .single();

    if (error) {
      console.error("Error submitting testimonial:", error);
      setError("Failed to submit your review. Please try again.");
    } else if (newReview) {
      setReviewText("");
      setIsOpen(false);
      setRating(0);
      setHasSubmitted(true);

      const formattedReview: Review = {
        id: newReview.id,
        body: newReview.body,
        name: newReview.username || "SmritiAI User",
        img: `https://i.pravatar.cc/100?u=${newReview.userId}`,
        rating: newReview.rating,
      };
      onReviewSubmit(formattedReview);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mb-12 text-center">
      {/* This button shows only if the user is logged OUT */}
      <SignedOut>
        <Link href="/sign-in">
          <button className="px-6 py-3 font-semibold text-black bg-primary rounded-lg shadow-lg hover:bg-primary/90 transition-colors">
            Login to Leave a Review
          </button>
        </Link>
      </SignedOut>

      {/* This section shows only if the user is logged IN */}
      <SignedIn>
        {isChecking ? (
          <div className="h-[48px]"></div> 
        ) : hasSubmitted ? (
          // No duplicate reviews, one testimonial per user logic
          <div className="p-4 text-center bg-green-900/50 border border-green-700 rounded-lg max-w-xl mx-auto">
            <p className="font-semibold text-green-300">Thank you for your review!</p>
          </div>
        ) : !isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="px-6 py-3 font-semibold text-black bg-primary rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
          >
            Write a Review
          </button>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto p-4 border border-gray-700 rounded-lg bg-gray-950/[.05] space-y-4"
          >
            <div>
              <label className="block mb-2 text-sm font-medium text-white">Your Rating</label>
              <Rating
                onClick={handleRating}
                initialValue={rating}
                SVGstyle={{ display: "inline" }}
                size={30}
              />
            </div>
            
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={`What do you think, ${user?.firstName}?`}
              className="w-full h-24 p-2 text-white bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={500}
              required
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || reviewText.trim().length === 0}
                className="px-6 py-2 font-semibold text-black bg-primary rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </SignedIn>
    </div>
  );
}