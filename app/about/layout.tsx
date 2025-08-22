import { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata('about');

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
