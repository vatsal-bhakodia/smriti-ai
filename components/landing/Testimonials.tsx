"use client";

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import AddTestimonial from "./AddTestimonial";
import { Rating } from "react-simple-star-rating";

interface Review {
  id: string;
  body: string;
  name: string;
  img: string;
  rating: number;
}

const ReviewCard = ({
  img,
  name,
  body,
  rating,
}: {
  img: string;
  name: string;
  body: string;
  rating: number;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
        </div>
      </div>
      <Rating
          initialValue={rating}
          readonly
          size={20}
          SVGstyle={{ display: "inline" }}
      />
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const supabase = useMemo(() => createClient(), []);

  const handleNewReview = (newReview: Review) => {
    setReviews((currentReviews) => {
      if (currentReviews.some((review) => review.id === newReview.id)) {
        return currentReviews;
      }
      return [newReview, ...currentReviews];
    });
  };

  useEffect(() => {
    const getTestimonials = async () => {
      const { data, error } = await supabase
        .from("testimonial")
        .select('id, body, userId, username, rating');

      if (error) {
        console.error("Error fetching testimonials:", error);
        return;
      }
      
      if (data) {
      const formattedReviews = data.map((t: { id: string; body: string; userId: string; username?: string, rating: number }) => ({
        id: t.id,
        body: t.body,
        name: t.username || "SmritiAI User",
        img: `https://i.pravatar.cc/100?u=${t.userId}`,
        rating: t.rating,
      }));
        setReviews(formattedReviews);
      }
    };

    getTestimonials();

    const channel: RealtimeChannel = supabase
      .channel('realtime-testimonials')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'testimonial' },
        (payload: { new: { id: string; body: string; userId: string; username: string, rating: number } }) => {
          const newReview = payload.new;
        
          const formattedNewReview: Review = {
            id: newReview.id,
            body: newReview.body,
            name: newReview.username || "Anonymous",
            img: `https://i.pravatar.cc/100?u=${newReview.userId}`,
            rating: newReview.rating,
          };
          
          setReviews((currentReviews) => {
            if (currentReviews.some((review) => review.id === formattedNewReview.id)) {
              return currentReviews;
            }
            return [formattedNewReview, ...currentReviews];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const firstRow = reviews.slice(0, reviews.length / 2);
  const secondRow = reviews.slice(reviews.length / 2);
  
  return (
    <section id="testimonials" className="w-full text-white px-6 md:px-20 py-24 relative">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight pb-1">
            Real Voices, 
            <span className="text-primary"> Real Impact </span>
            </h2>
            <p className="text-gray-400 text-lg">
            Discover how Smriti AI helps learners retain knowledge longer and faster.
            </p>
        </div>


        {/* FIX 4: Added the Marquee display components back in */}
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            <Marquee pauseOnHover className="[--duration:20s]">
                {firstRow.map((review) => (
                <ReviewCard key={review.id} {...review} />
                ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:20s]">
                {secondRow.map((review) => (
                <ReviewCard key={review.id} {...review} />
                ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
        </div>

        <AddTestimonial onReviewSubmit={handleNewReview}/>
    </section>
  );
}
