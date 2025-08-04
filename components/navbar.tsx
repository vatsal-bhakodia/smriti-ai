import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Brain, Star } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-background/50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <Brain className="me-[5px] h-5 w-5 text-primary" />
              <span className="text-xl font-bold">Smriti AI</span>
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            {/* Contact Link */}
            <Link href="/contact" className="hidden md:block">
              <Button variant="ghost" className="rounded-full">
                Contact
              </Button>
            </Link>

            {/* GitHub Star Button */}
            <a
              href="https://github.com/vatsal-bhakodia/smriti-ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="rounded-full flex items-center gap-2"
              >
                <Star className="h-4 w-4 text-primary" />
                Star
              </Button>
            </a>

            <SignedOut>
              <Link href="/sign-in" className="hidden md:block">
                <Button variant="outline" className="rounded-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-primary rounded-full">Sign Up</Button>
              </Link>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}
