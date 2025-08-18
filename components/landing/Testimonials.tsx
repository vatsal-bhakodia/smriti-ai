"use client";

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { reviews } from "@/testimonals/reviews";

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  body,
}: {
  img: string;
  name: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4 transition-transform duration-300 transform hover:-translate-y-1 hover:shadow-lg",
        // Light mode
        "light:border-gray-200/40 light:bg-white/70 light:hover:bg-white/80 light:text-gray-900",
        // Dark mode
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15] dark:text-white"
      )}
    >
      <div className="flex flex-row items-center gap-2 mb-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <figcaption className="text-sm font-medium light:text-gray-900 dark:text-white">
          {name}
        </figcaption>
      </div>
      <blockquote className="text-sm light:text-gray-700 dark:text-gray-300">
        {body}
      </blockquote>
    </figure>
  );
};

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="w-full px-6 md:px-20 py-24 relative bg-gray-50 dark:bg-background transition-colors duration-300 text-gray-900 light:text-gray-900"
    >
      {/* Heading */}
      <div className="text-center mb-16 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight light:text-gray-900 dark:text-white">
          Real Voices,{" "}
          <span className="text-lime-600 dark:text-lime-400"> Real Impact </span>
        </h2>
        <p className="text-lg light:text-gray-700 dark:text-gray-300">
          Discover how Smriti AI helps learners retain knowledge longer and faster.
        </p>
      </div>

      {/* Marquee / Review Cards */}
      <div className="relative flex flex-col items-center justify-center w-full overflow-hidden">
        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>

        <Marquee reverse pauseOnHover className="[--duration:20s] mt-6">
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>

        {/* Subtle light-mode glow like Features */}
        <div className="absolute bottom-5 left-1/2 w-[180px] h-[180px] bg-green-400 light:bg-green-400 opacity-40 blur-[200px] transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-300 dark:bg-primary"></div>

        {/* Gradient edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background light:from-gray-50"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background light:from-gray-50"></div>
      </div>
    </section>
  );
}

