import { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata('contributors');

export default function ContributorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
