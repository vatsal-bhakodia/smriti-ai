import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Brain, Star, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-background/50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center w-1/5">
            <Link
              href="/#"
              className="flex items-center cursor-pointer hover:opacity-90 transition-all duration-300 group"
            >
              <Brain className="me-[5px] h-5 w-5 text-[#adff2f]" />
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:from-[#adff2f] group-hover:to-[#9dff07] transition-all duration-300">
                Smriti AI
              </span>
            </Link>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center justify-center gap-8 w-3/5">
            <Link href="/#" className="cursor-pointer">
              <Button
                variant="ghost"
                className="rounded-full cursor-pointer hover:bg-[#adff2f]/10 hover:text-[#adff2f] transition-all duration-300 hover:scale-105"
              >
                Home
              </Button>
            </Link>
            <Link href="/#about" className="cursor-pointer">
              <Button
                variant="ghost"
                className="rounded-full cursor-pointer hover:bg-[#adff2f]/10 hover:text-[#adff2f] transition-all duration-300 hover:scale-105"
              >
                About Us
              </Button>
            </Link>
            <Link href="/contact" className="cursor-pointer">
              <Button
                variant="ghost"
                className="rounded-full cursor-pointer hover:bg-[#adff2f]/10 hover:text-[#adff2f] transition-all duration-300 hover:scale-105"
              >
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center justify-end gap-4 w-1/5">
            {/* GitHub Star Button */}
            <a
              href="https://github.com/vatsal-bhakodia/smriti-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <Button
                variant="outline"
                className="rounded-full flex items-center gap-2 cursor-pointer border-[#adff2f]/30 text-[#adff2f] hover:bg-gradient-to-r hover:from-[#adff2f] hover:to-[#9dff07] hover:text-black hover:border-[#adff2f] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#adff2f]/25"
              >
                <Star className="h-4 w-4" />
                Star
              </Button>
            </a>

            <SignedOut>
              <Link href="/sign-in" className="cursor-pointer">
                <Button className="bg-gradient-to-r from-[#adff2f] to-[#9dff07] text-black rounded-full cursor-pointer hover:from-[#9dff07] hover:to-[#adff2f] hover:shadow-lg hover:shadow-[#adff2f]/30 transition-all duration-300 hover:scale-105 border-0">
                  Sign In
                </Button>
              </Link>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard" className="cursor-pointer">
                  <Button
                    variant="outline"
                    className="rounded-full flex items-center gap-2 cursor-pointer border-[#adff2f]/30 text-[#adff2f] hover:bg-gradient-to-r hover:from-[#adff2f] hover:to-[#9dff07] hover:text-black hover:border-[#adff2f] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#adff2f]/25"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
              </Link>
            </SignedIn>

            <SignedIn>
              <div className="cursor-pointer">
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}
