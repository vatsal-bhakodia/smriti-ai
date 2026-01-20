"use client";

import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Brain, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { SidebarContext } from "@/contexts/SidebarContext";
import { ActionButton } from "@/components/ActionButton";

const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// ---------------- Authenticated Navbar Component ----------------
export default function Navbar() {
  const pathname = usePathname();

  // Use sidebar context directly - it will be undefined if not in provider
  const sidebarContext = useContext(SidebarContext);

  // Check if we're on a resource page (where sidebar should be available)
  const isResourcePage =
    pathname?.startsWith("/folder") || pathname?.startsWith("/resource");

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

          {/* Right-side buttons */}
          <div className="flex items-center justify-end gap-2 w-1/5">
            <ActionButton
              href="/dashboard"
              label="Dashboard"
              icon={LayoutDashboard}
              variant="outline"
              className="rounded-full flex items-center gap-2 cursor-pointer border-primary/30 text-primary hover:bg-linear-to-r hover:from-primary hover:to-primary-dark hover:text-black hover:border-primary transition-all duration-300 hover:scale-105"
            />
            {/* Profile */}
            {hasClerk && <UserButton />}

            {/* Mobile Sidebar Toggle (only for resource pages without desktop toggle) */}
            {isResourcePage && sidebarContext && (
              <button
                onClick={() => sidebarContext.toggleSidebar()}
                className="lg:hidden flex items-center p-2 rounded-full hover:bg-primary/10"
              >
                <Menu className="h-6 w-6 text-primary" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
