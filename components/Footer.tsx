"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Brain, ArrowUpRight, Heart } from "lucide-react";

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      if (pathname === "/") {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push("/" + href);
      }
    }
  };

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Study Tools", href: "#" },
      { name: "Mind Maps", href: "#" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Blog", href: "#" },
      { name: "Contact", href: "/contact" },
      {
        name: "Our Contributors",
        href: "https://github.com/vatsal-bhakodia/smriti-ai/graphs/contributors",
      },
    ],
    support: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms-of-use" },
      {
        name: "Project Status",
        href: "https://github.com/vatsal-bhakodia/smriti-ai/actions",
      },
    ],
  };

  return (
    <footer className="bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Logo + Description */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <Brain className="h-7 w-7 text-green-500 dark:text-green-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-green-500">
                Smriti AI
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 max-w-md leading-relaxed transition-colors duration-300">
              Transform passive learning into active remembering. Smriti AI helps
              you retain knowledge faster with AI-powered study tools and spaced
              repetition.
            </p>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-gray-900 dark:text-white font-semibold text-sm uppercase tracking-wider transition-colors duration-300">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      onClick={
                        link.href.startsWith("#")
                          ? (e) => handleNav(e, link.href)
                          : undefined
                      }
                      className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-green-500 transition-all duration-300 hover:translate-x-1"
                    >
                      <span>{link.name}</span>
                      <ArrowUpRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-neutral-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
            © {currentYear} Smriti AI. All rights reserved.
          </span>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
            <span className="hidden md:block">Made in India with</span>
            <Heart className="h-3 w-3 text-red-500 animate-pulse" />
            <span className="hidden md:block">for learners</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
