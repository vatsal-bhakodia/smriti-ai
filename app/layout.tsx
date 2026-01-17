import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import BackToTopButton from "@/components/ui/BackToTopButton";
import { SkipLinks } from "@/components/accessibility/SkipLinks";
import {
  generateMetadataUtil,
  generateViewport,
} from "@/utils/generateMetadata";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

export const metadata = generateMetadataUtil({
  title: "Smriti AI - Online Learning with AI Tutor",
  description:
    "Transform your learning with Smriti AI. Generate summaries, flashcards, mindmaps, quizzes, and personalized roadmaps.",
  keywords: ["AI study companion", "smart learning", "AI flashcards"],
});

export const viewport = generateViewport();

// Clerk appearance config matching the app theme
const clerkAppearance = {
  variables: {
    colorBackground: "#171717",
    colorPrimary: "#a3ff19",
    colorPrimaryForeground: "#222",
    colorForeground: "#fff",
    colorInput: "#222",
    colorBorder: "#333",
    fontSize: "14px",
  },
  elements: {
    cardBox: {
      boxShadow: "none",
    },
    card: {
      width: "100%",
    },
    formFieldInput: {
      backgroundColor: "#222",
      color: "#fff",
      border: "1px solid #fff",
      height: "35px",
    },
    formButtonPrimary: {
      background: "#a3ff19",
      color: "#333",
      border: "none",
      boxShadow: "0 0 10px #39FF14, 0 0 20px #39FF14",
      fontWeight: 700,
    },
    formFieldLabel: { color: "#eee" },
    socialButtonsBlockButton__google: {
      backgroundColor: "#222",
      transition: "all 0.2s",
      height: "40px",
      margin: "0 auto",
    },
    socialButtonsBlockButtonText: {
      color: "#fff",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
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

          {children}
          <Toaster />
          <BackToTopButton />
        </body>
      </html>
    </ClerkProvider>
  );
}
