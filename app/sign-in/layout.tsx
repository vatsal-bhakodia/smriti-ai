import { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata('signIn');

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
