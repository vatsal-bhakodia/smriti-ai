import type { Metadata } from "next";
import { generateMetadataUtil } from "@/utils/generateMetadata";
import Contact from "@/components/Contact";

export const metadata: Metadata = generateMetadataUtil({
  title: "Contact Us",
  description:
    "Get in touch with the Smriti AI team. Have questions about our AI-powered study tools? Need support? Want to provide feedback? We're here to help you learn smarter.",
  keywords: [
    "Smriti AI contact",
    "customer support",
    "AI learning support",
    "study assistant help",
    "contact form",
    "feedback",
    "technical support",
    "education technology support",
  ],
  url: "https://www.smriti.live/contact",
});

export default function Page() {
  return <Contact />;
}
