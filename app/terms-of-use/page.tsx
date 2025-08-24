import Footer from "@/components/Footer";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Terms of Use",
    description: "Understand the terms and conditions for using Smriti AI responsibly.",
    keywords: ["terms of use", "smriti", "ai", "policy", "rules", "conditions"],
  };
}

export default function TermsOfUse() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-10 pt-24 pb-20">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Terms of Use
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          These Terms of Use govern your access to and use of Smriti AI and its
          services. By accessing or using any part of the site, you agree to be
          bound by these terms.
        </p>

        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          1. Acceptance of Terms
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          By using this website, you agree to comply with and be legally bound
          by the terms and conditions outlined here. If you do not agree with
          any part of these terms, please refrain from using our services.
        </p>

        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          2. Changes to the Terms
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          We reserve the right to update or modify these Terms at any time
          without prior notice. Continued use of the site after changes
          indicates your acceptance of the new terms.
        </p>

        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          3. User Conduct
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Users agree not to misuse the site or its content. Any illegal,
          harmful, or abusive behavior will result in immediate termination of
          access.
        </p>

        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          4. Contact
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          If you have any questions regarding these Terms of Use, please contact
          us through our support page.
        </p>
      </div>
      <Footer />
    </>
  );
}
