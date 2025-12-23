"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, LayoutDashboard, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ActionButton } from "@/components/ActionButton";

// ---------------- Navigation Links ----------------
const navigationLinks = [
  { href: "/#", label: "Home" },
  { href: "/dashboard/interview", label: "Interview Prep" },
  { href: "/about", label: "About Us" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact Us" },
];

// ---------------- Mobile Action Buttons ----------------
const mobileActionButtons: Array<{
  href: string;
  label: string;
  icon?: React.ElementType;
  variant?: "outline" | "ghost" | "default";
  authRequired?: boolean;
  external?: boolean;
}> = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    variant: "outline",
    authRequired: true,
  },
  {
    href: "/dashboard/interview",
    label: "Interview Prep",
    variant: "outline",
    authRequired: true,
  },
  {
    href: "https://github.com/vatsal-bhakodia/smriti-ai",
    label: "Star on GitHub",
    icon: Star,
    variant: "outline",
    external: true,
  },
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
    "rounded-full cursor-pointer hover:bg-[#adff2f]/10 hover:text-[#adff2f] transition-all duration-300 hover:scale-105";

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

// ---------------- Public Navbar Component ----------------
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => setIsMenuOpen(false), [pathname]);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/50 border-b border-border">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center w-1/5 flex-shrink-0">
            <Link
              href="/#"
              className="flex items-center cursor-pointer hover:opacity-90 transition-all duration-300 group whitespace-nowrap"
            >
              <Brain className="me-[5px] h-5 w-5 text-[#adff2f]" />
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:from-[#adff2f] group-hover:to-[#9dff07] transition-all duration-300">
                Smriti AI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center justify-center gap-4 w-3/5">
            {navigationLinks.map((link) => (
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
                  className="rounded-full flex items-center gap-2 cursor-pointer border-[#adff2f]/30 text-[#adff2f] hover:bg-gradient-to-r hover:from-[#adff2f] hover:to-[#9dff07] hover:text-black hover:border-[#adff2f] transition-all duration-300 hover:scale-105"
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
                  className="rounded-full flex items-center gap-2 border-[#adff2f]/30 text-[#adff2f] hover:bg-gradient-to-r hover:from-[#adff2f] hover:to-[#9dff07] hover:text-black hover:border-[#adff2f] transition-all duration-300 hover:scale-105 px-4 py-2"
                />
                <ActionButton
                  href="/sign-up"
                  label="Sign Up"
                  className="rounded-full bg-gradient-to-r from-[#adff2f] to-[#9dff07] text-black hover:text-black transition-all duration-300 hover:scale-105 px-4 py-2"
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
              className="md:hidden flex items-center p-2 rounded-full hover:bg-[#adff2f]/10"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-[#adff2f]" />
              ) : (
                <Menu className="h-6 w-6 text-[#adff2f]" />
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
              className="md:hidden overflow-hidden bg-background/95 border-t border-border"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="py-4 px-2 space-y-3"
              >
                {/* Mobile Navigation Links */}
                {navigationLinks.map((link) => (
                  <NavButton
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    className="w-full text-left"
                  />
                ))}

                {/* Mobile Action Buttons */}
                {mobileActionButtons.map((button) =>
                  button.authRequired ? (
                    <SignedIn key={button.href}>
                      <ActionButton
                        href={button.href}
                        label={button.label}
                        icon={button.icon}
                        variant={button.variant}
                        external={button.external}
                        className="w-full rounded-full flex items-center justify-center gap-2 border-[#adff2f]/30 text-[#adff2f] hover:bg-gradient-to-r hover:from-[#adff2f] hover:to-[#9dff07] hover:text-black"
                      />
                    </SignedIn>
                  ) : (
                    <ActionButton
                      key={button.href}
                      href={button.href}
                      label={button.label}
                      icon={button.icon}
                      variant={button.variant}
                      external={button.external}
                      className="w-full rounded-full flex items-center justify-center gap-2 border-[#adff2f]/30 text-[#adff2f] hover:bg-gradient-to-r hover:from-[#adff2f] hover:to-[#9dff07] hover:text-black"
                    />
                  )
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
