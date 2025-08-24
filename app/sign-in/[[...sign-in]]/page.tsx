import SignInPage from "./signinpage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Sign In",
    description: "Securely sign in to your Smriti AI account.",
    keywords: ["signin", "login", "smriti", "ai", "account", "authentication"],
  };
}

export default function Page() {
  return <SignInPage />;
}