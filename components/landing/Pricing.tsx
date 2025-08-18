"use client";
import { Check } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const pricingPlans = [
  {
    title: "Starter",
    price: "$0",
    description:
      "Perfect for students or personal use. Start your learning journey with AI assistance.",
    features: [
      "Limited Access to Mindmaps",
      "Basic MCQs Generator",
      "Link storage up to 1GB",
    ],
    cta: "Get Started",
  },
  {
    title: "Pro",
    price: "$9/mo",
    description:
      "Best for regular learners. Boost your revision game with advanced AI tools.",
    features: [
      "Unlimited mindmaps",
      "Daily MCQs & Recaps",
      "Storage up to 10GB",
      "Early access to new features",
    ],
    cta: "Upgrade to Pro",
  },
  {
    title: "SmritiX",
    price: "$29/mo",
    description:
      "Built for teams, coaching institutes & educators to manage multiple learners.",
    features: [
      "Team access & dashboards",
      "50GB cloud link vault",
      "Advanced analytics & reminders",
      "Priority support",
    ],
    cta: "Talk to Sales",
    link: "/contact",
  },
];

export const Pricing = () => {
  const { isSignedIn } = useUser();

  return (
    <section
      id="pricing"
      className="text-gray-900 dark:text-white flex flex-col justify-center items-center px-6 py-24 relative bg-gray-50 dark:bg-background transition-colors duration-300"
    >
      {/* Heading */}
      <div className="text-center mb-16 max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-gray-900 dark:text-white">
          Simple, <span className="text-lime-600 dark:text-lime-400">Transparent</span> Price
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl leading-relaxed">
          Choose the plan that fits your learning style and boost your retention with Smriti AI.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto w-full">
        {pricingPlans.map((plan) => {
          let buttonLink = "/sign-up";
          if (plan.title === "SmritiX") buttonLink = "/contact";
          else if (isSignedIn) buttonLink = "/dashboard";

          return (
            <div
              key={plan.title}
              className="bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur p-6 md:p-8 rounded-xl transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <h3 className="text-2xl font-extrabold mb-2 text-lime-600 dark:text-primary">{plan.title}</h3>
              <p className="text-3xl font-extrabold mb-4 text-gray-900 dark:text-white">{plan.price}</p>
              <p className="text-gray-700 dark:text-gray-400 mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-6 text-sm text-gray-700 dark:text-gray-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="text-lime-600 dark:text-primary" /> {feature}
                  </li>
                ))}
              </ul>

            <Link href={buttonLink}>
  <button
    className={`w-full py-3 rounded-xl font-semibold border 
      ${isSignedIn ? "border-gray-300 dark:border-white/20" : "border-gray-300 dark:border-white/20"} 
      ${isSignedIn ? "bg-white text-gray-900 hover:bg-lime-200 dark:bg-gray-800 dark:text-white dark:hover:bg-lime-600" : "bg-white text-gray-900 hover:bg-lime-200 dark:bg-gray-800 dark:text-white dark:hover:bg-lime-600"} 
      transition-colors duration-300`}
  >
    {plan.cta}
  </button>
</Link>

            </div>
          );
        })}
      </div>

      {/* Background Glow */}
      <div className="absolute bottom-5 left-1/2 w-[180px] h-[180px] bg-lime-400 dark:bg-primary opacity-100 blur-[200px] transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-300"></div>
    </section>
  );
};
