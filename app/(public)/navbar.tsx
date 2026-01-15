"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  LayoutDashboard,
  ChevronDown,
  FileText,
  File,
  Youtube,
  Layers,
  Network,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Menu, X } from "lucide-react";
import { ActionButton } from "@/components/ActionButton";

// ---------------- Tools Data Structure ----------------
const toolsData = {
  flashcard: {
    title: "Flashcard",
    icon: Layers,
    items: [
      {
        href: "/tools/text-to-flashcards",
        label: "Text to Flashcards",
        icon: FileText,
        description: "Convert text content into interactive flashcards",
        default: true,
      },
      {
        href: "/tools/pdf-to-flashcards",
        label: "PDF to Flashcards",
        icon: File,
        description: "Transform PDF documents into study flashcards",
      },
      {
        href: "/tools/youtube-to-flashcards",
        label: "YouTube to Flashcards",
        icon: Youtube,
        description: "Create flashcards from YouTube video content",
      },
    ],
  },
  mindmap: {
    title: "Mindmap",
    icon: Network,
    items: [
      {
        href: "/tools/text-to-mindmaps",
        label: "Text to Mindmaps",
        icon: FileText,
        description: "Visualize text content as structured mindmaps",
        default: true,
      },
      {
        href: "/tools/pdf-to-mindmaps",
        label: "PDF to Mindmaps",
        icon: File,
        description: "Generate mindmaps from PDF documents",
      },
      {
        href: "/tools/youtube-to-mindmaps",
        label: "YouTube to Mindmaps",
        icon: Youtube,
        description: "Create visual mindmaps from YouTube videos",
      },
    ],
  },
  quiz: {
    title: "Quiz",
    icon: HelpCircle,
    items: [
      {
        href: "/tools/text-to-quiz",
        label: "Text to Quiz",
        mobileLabel: "Quiz",
        icon: FileText,
        description: "Generate quizzes from text content",
        default: true,
      },
      {
        href: "/tools/pdf-to-quiz",
        label: "PDF to Quiz",
        mobileLabel: "Quiz",
        icon: File,
        description: "Create quizzes from PDF documents",
      },
      {
        href: "/tools/youtube-to-quiz",
        label: "YouTube to Quiz",
        icon: Youtube,
        description: "Build quizzes from YouTube video content",
      },
    ],
  },
};

// ---------------- Navigation Links ----------------
const navigationLinks = [
  { href: "/#", label: "Home" },
  { href: "/resources", label: "Study Resources" },
  { href: "/result", label: "GGSIPU Result" },
  // { href: "/#pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

// ---------------- Reusable Nav Button ----------------
type NavButtonProps = {
  href: string;
  label: string;
  className?: string;
  external?: boolean;
};

const NavButton = ({
  href,
  label,
  className = "",
  external = false,
}: NavButtonProps) => {
  const baseClass =
    "rounded-full cursor-pointer hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Button variant="ghost" className={`${baseClass} ${className}`}>
          {label}
        </Button>
      </a>
    );
  }

  return (
    <Link href={href}>
      <Button variant="ghost" className={`${baseClass} ${className}`}>
        {label}
      </Button>
    </Link>
  );
};

// ---------------- Mega Menu Component ----------------
type MegaMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const MegaMenu = ({ isOpen, onClose }: MegaMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[90vw] max-w-5xl bg-background border border-border rounded-lg shadow-lg p-8"
        onMouseLeave={onClose}
      >
        <div className="grid grid-cols-3 gap-8">
          {Object.values(toolsData).map((category) => {
            const CategoryIcon = category.icon;
            return (
              <div key={category.title} className="space-y-4">
                <h3 className="font-medium text-md text-foreground mb-4 flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                    <CategoryIcon className="h-5 w-5 text-primary" />
                  </div>
                  {category.title}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="group block p-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-all duration-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                                <IconComponent className="h-4 w-4 text-primary" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-200 mb-1.5">
                                {item.label}
                              </h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ---------------- Public Navbar Component ----------------
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => setIsMenuOpen(false), [pathname]);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/50 border-b border-border">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center w-1/5 shrink-0">
            <Link
              href="/#"
              className="flex items-center cursor-pointer hover:opacity-90 transition-all duration-300 group whitespace-nowrap"
            >
              <Brain className="me-[5px] h-5 w-5 text-primary" />
              <span className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary-dark transition-all duration-300">
                Smriti AI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center justify-center gap-4 w-3/5 relative">
            {/* Home */}
            <NavButton
              href={navigationLinks[0].href}
              label={navigationLinks[0].label}
            />
            {/* Tools Mega Menu Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <Button
                variant="ghost"
                className="rounded-full cursor-pointer hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105 flex items-center gap-1"
              >
                Tools
                <ChevronDown className="h-4 w-4" />
              </Button>
              <MegaMenu
                isOpen={isMegaMenuOpen}
                onClose={() => setIsMegaMenuOpen(false)}
              />
            </div>
            {/* Pricing and Contact */}
            {navigationLinks.slice(1).map((link) => (
              <NavButton key={link.href} href={link.href} label={link.label} />
            ))}
          </div>

          {/* Right-side buttons */}
          <div className="flex items-center justify-end gap-2 w-1/5">
            {/* Dashboard (Desktop) */}
            <SignedIn>
              <div className="hidden md:flex items-center">
                <ActionButton
                  href="/dashboard"
                  label="Dashboard"
                  icon={LayoutDashboard}
                  variant="outline"
                  className="rounded-full flex items-center gap-2 cursor-pointer border-primary/30 text-primary hover:bg-linear-to-r hover:from-primary hover:to-primary-dark hover:text-black hover:border-primary transition-all duration-300 hover:scale-105"
                />
              </div>
            </SignedIn>

            {/* Sign In / Sign Up (Desktop) */}
            <SignedOut>
              <div className="hidden md:flex items-center gap-2">
                <ActionButton
                  href="/sign-in"
                  label="Sign In"
                  variant="outline"
                  className="rounded-full flex items-center gap-2 border-primary/30 text-primary hover:bg-linear-to-r hover:from-primary hover:to-primary-dark hover:text-black hover:border-primary transition-all duration-300 hover:scale-105 px-4 py-2"
                />
                <ActionButton
                  href="/sign-up"
                  label="Sign Up"
                  className="rounded-full bg-linear-to-r from-primary to-primary-dark text-black hover:text-black transition-all duration-300 hover:scale-105 px-4 py-2"
                />
              </div>
            </SignedOut>

            {/* Profile */}
            <SignedIn>
              <UserButton />
            </SignedIn>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex items-center p-2 rounded-full hover:bg-primary/10"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-primary" />
              ) : (
                <Menu className="h-6 w-6 text-primary" />
              )}
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
              className="md:hidden overflow-hidden bg-background/98 backdrop-blur-lg border-t border-border shadow-lg"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="py-6 px-4 space-y-1"
              >
                {/* Mobile Navigation Links */}
                <div className="space-y-1">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200 text-sm font-medium text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile Tools Dropdown */}
                <div className="border-b border-t border-border">
                  <button
                    onClick={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200 text-sm font-semibold text-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Tools
                    </span>
                    <motion.div
                      animate={{ rotate: isMobileToolsOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isMobileToolsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 pr-2 py-2 space-y-1 mt-2">
                          {Object.values(toolsData).map((category) => {
                            const defaultItem = category.items.find(
                              (item) => (item.default = true)
                            );
                            if (!defaultItem) return null;
                            return (
                              <Link
                                key={category.title}
                                href={defaultItem.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-4 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors duration-200 text-sm font-medium"
                              >
                                {category.title}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Dashboard Link */}
                <div className="space-y-1">
                  <SignedIn>
                    <ActionButton
                      href="/dashboard"
                      label="Dashboard"
                      icon={LayoutDashboard}
                      variant="outline"
                      external={true}
                      className="w-full rounded-lg flex items-center justify-center gap-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-200 mt-2"
                    />
                  </SignedIn>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
