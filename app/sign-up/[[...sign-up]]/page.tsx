import SignUpPage from "./signuppage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Sign Up",
    description: "Create your Smriti AI account securely.",
    keywords: ["signup", "register", "smriti", "ai", "account", "authentication"],
  };
}

export default function Page() {
  return <SignUpPage />;
}
