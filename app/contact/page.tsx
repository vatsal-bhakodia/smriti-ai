import ContactPage from "./contactpage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact",
    description:
      "Get in touch with Smriti AI. Reach out for support, feedback, or collaboration — we're here to help you learn smarter.",
    keywords: ["contact", "smriti", "ai", "support", "feedback", "collaboration"],
  };
}

export default function Contact() {
  return <ContactPage />;
}
