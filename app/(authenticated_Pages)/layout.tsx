"use client";

import { usePathname } from "next/navigation";
import AuthGate from "@/components/AuthGate";
import Navbar from "./navbar";
import { SidebarProvider } from "@/contexts/SidebarContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isResourcePage =
    pathname?.startsWith("/folder") || pathname?.startsWith("/resource");

  const content = (
    <>
      <Navbar />
      <main className="pt-24">{children}</main>
    </>
  );

  return (
    <AuthGate>
      {isResourcePage ? <SidebarProvider>{content}</SidebarProvider> : content}
    </AuthGate>
  );
}
