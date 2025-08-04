import React from "react";
import Link from "next/link";
import { Brain, ArrowUpRight, Heart } from "lucide-react";
import handleSmoothScroll from "@/utils/smooth-scroll";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Study Tools", href: "#" },
      { name: "Mind Maps", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Blog", href: "/blogs" },
      { name: "Contact", href: "/contact" },

      {
        name: "Our Contributors",
        href: "https://github.com/vatsal-bhakodia/smriti-ai/graphs/contributors",
      },
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Privacy Policy", href: "/privacy-policy" }, // ✅ updated
      { name: "Terms of Service", href: "/terms-of-use" },  // ✅ updated
      {
        name: "Project Status",
        href: "https://github.com/vatsal-bhakodia/smriti-ai/actions",
      },
    ],
  };

  return (
    <footer className="bg-black border-t border-neutral-900">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center group">
              <Link href="/" className="flex items-center">
                <div className="relative">
                  <Brain className="me-[5px] h-6 w-6 text-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                  Smriti AI
                </span>
              </Link>
            </div>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              Transform passive learning into active remembering. Smriti AI
              helps you retain knowledge faster with AI-powered study tools and
              spaced repetition.
            </p>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      // Disable smooth scroll for full page navigations
                      onClick={
                        link.href.startsWith("#") ? handleSmoothScroll : undefined
                      }
                      className="group flex items-center text-gray-400 hover:text-primary text-sm transition-all duration-300 hover:translate-x-1"
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

      {/* Bottom Section */}
      <div className="border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>© {currentYear} Smriti AI. All rights reserved.</span>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-gray-400 flex items-center space-x-2">
              <div className="hidden md:flex items-center space-x-1">
                <span>Made in India with</span>
                <Heart className="h-3 w-3 text-red-500 animate-pulse" />
                <span>for learners</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
