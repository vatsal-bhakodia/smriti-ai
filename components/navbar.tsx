"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, LayoutDashboard, Menu, Star, X,Sun,Moon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const pathname = usePathname();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (storedTheme) setTheme(storedTheme);
    else setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const isDark = theme === "dark";

  return (
    <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-white/50 border-b border-gray-300 dark:bg-background/50 dark:border-border transition-colors duration-300">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      {/* Logo */}
      <div className="flex items-center flex-shrink-0 w-1/5">
        <Link
          href="/#"
          className="flex items-center cursor-pointer hover:opacity-90 transition-all duration-300 group whitespace-nowrap"
        >
          <Brain className="me-[5px] h-5 w-5 text-[#adff2f] dark:text-[#adff2f]" />
          <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:from-[#adff2f] group-hover:to-[#adff2f] transition-all duration-300">
            Smriti AI
          </span>
        </Link>
      </div>

      {/* Center Navigation Links - Hidden on Mobile */}
      <div className="hidden md:flex items-center justify-center gap-4 w-3/5">
        {["Home", "About Us", "Contributors", "Contact Us"].map((label, idx) => {
          const href = label === "Home" ? "/#" : `/${label.toLowerCase().replace(" ", "-")}`;
          return (
            <Link href={href} key={idx}>
              <Button
                variant="ghost"
                className="rounded-full cursor-pointer hover:bg-[#adff2f]/10 hover:text-[#adff2f] dark:hover:bg-[#adff2f]/10 dark:hover:text-[#adff2f] transition-all duration-300 hover:scale-105"
              >
                {label}
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Right side buttons */}
      <div className="flex items-center justify-end space-x-2 w-1/5">
        {/* Desktop Dashboard Button */}
        <SignedIn>
          <div className="hidden md:flex items-center">
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="rounded-full flex items-center gap-2 border-[#adff2f]/30 text-[#adff2f] dark:border-[#adff2f]/30 dark:text-[#adff2f] hover:bg-gradient-to-r hover:from-[#adff2f] hover:to-[#9dff07] dark:hover:from-[#adff2f] dark:hover:to-[#9dff07] hover:text-black transition-all duration-300 hover:scale-105"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </SignedIn>

        {/* Desktop Sign In / Sign Up */}
        <SignedOut>
          <div className="flex items-center gap-2">
            <Link href="/sign-in">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full flex items-center gap-2 border-[#adff2f]/30 text-[#adff2f] dark:border-[#adff2f]/30 dark:text-[#adff2f] hover:bg-gradient-to-r hover:from-[#adff2f] hover:to-[#9dff07] dark:hover:from-[#adff2f] dark:hover:to-[#9dff07] hover:text-black transition-all duration-300 hover:scale-105 px-4 py-2"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                size="sm"
                className="rounded-full bg-gradient-to-r from-[#adff2f] to-[#9dff07] text-black dark:bg-gradient-to-r dark:from-[#adff2f] dark:to-[#9dff07] hover:from-green-400 hover:to-green-500 dark:hover:from-[#9dff07] dark:hover:to-[#adff2f] transition-all duration-300 hover:scale-105 px-4 py-2"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </SignedOut>

        {/* Profile Button */}
        <SignedIn>
          <div className="flex items-center">
            <UserButton />
          </div>
        </SignedIn>

        {/* Theme Toggle Icon */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-green-500 dark:text-[#adff2f] hover:scale-110 hover:shadow-lg hover:shadow-green-500/40 dark:hover:shadow-[#adff2f]/40 transition-all duration-300"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center p-2 rounded-full hover:bg-green-500/10 dark:hover:bg-[#adff2f]/10"
        >
          {isMenuOpen ? <X className="h-6 w-6 text-green-500 dark:text-[#adff2f]" /> : <Menu className="h-6 w-6 text-green-500 dark:text-[#adff2f]" />}
        </button>
      </div>
    </div>

    {/* Mobile Menu */}
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden overflow-hidden bg-white/95 dark:bg-background/95 border-t border-gray-300 dark:border-border transition-colors duration-300"
        >
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            exit={{ y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="py-4 px-2 space-y-3"
          >
            {["Home", "About Us", "Contributors", "Contact Us"].map((label, idx) => {
              const href = label === "Home" ? "/#" : `/${label.toLowerCase().replace(" ", "-")}`;
              return (
                <Link href={href} key={idx}>
                  <Button
                    variant="ghost"
                    className="w-full text-left rounded-full hover:bg-[#adff2f]/10 hover:text-[#adff2f] dark:hover:bg-[#adff2f]/10 dark:hover:text-[#adff2f]"
                  >
                    {label}
                  </Button>
                </Link>
              );
            })}

            <SignedIn>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="w-full rounded-full flex items-center justify-center gap-2 border-[#adff2f]/30 text-[#adff2f] dark:border-[#adff2f]/30 dark:text-[#adff2f] hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 dark:hover:from-[#adff2f] dark:hover:to-[#9dff07] hover:text-black"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </SignedIn>

            <a href="https://github.com/vatsal-bhakodia/smriti-ai" target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="w-full rounded-full flex items-center justify-center gap-2 border-[#adff2f]/30 text-[#adff2f] dark:border-[#adff2f]/30 dark:text-[#adff2f] hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 dark:hover:from-[#adff2f] dark:hover:to-[#9dff07] hover:text-black"
              >
                <Star className="h-4 w-4" />
                Star on GitHub
              </Button>
            </a>

            {/* Mobile Theme Toggle */}
            <div className="flex justify-center pt-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-[#adff2f] dark:text-[#adff2f] hover:scale-110 hover:shadow-lg hover:shadow-[#adff2f]-500/40 dark:hover:shadow-[#adff2f]/40 transition-all duration-300"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</nav>

  );
}