import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "./accessibility.css";
import Navbar from "@/components/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import BackToTopButton from "@/components/ui/BackToTopButton";
import { SkipLinks } from "@/components/accessibility/SkipLinks";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Smriti AI",
  description: "Smriti AI - Remember Smarter",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" suppressHydrationWarning>
        <body
          className={`${poppins.variable} antialiased`}
          suppressHydrationWarning
        >
          {/* Skip Links for keyboard navigation */}
          <SkipLinks />
          
          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-K0Q80X3Y6D"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-K0Q80X3Y6D');
            `}
          </Script>

          <Navbar />
          <main id="main-content" className="pt-32">{children}</main>
          <Toaster />
          <BackToTopButton />
        </body>
      </html>
    </ClerkProvider>
  );
}
