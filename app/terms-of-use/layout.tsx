import { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata('termsOfUse');

export default function TermsOfUseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
