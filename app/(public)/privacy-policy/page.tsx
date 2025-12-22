import { generateMetadataUtil } from "@/utils/generateMetadata";
export const metadata = generateMetadataUtil({
  title: "Privacy Policy",
  description:
    "Read the Privacy Policy of Smriti AI to learn how we collect, use, and protect your personal information. Your data privacy and security are our top priority.",
  keywords: [
    "Smriti AI Privacy Policy",
    "AI data protection",
    "Smriti AI security",
    "user privacy",
    "data collection policy",
    "GDPR compliance",
    "AI privacy guidelines",
    "data protection",
    "privacy rights",
    "secure AI platform",
  ],
  url: "https://www.smriti.live/privacy-policy",
});

export default function PrivacyPolicy() {
  return (
    <div className="pt-14 max-w-4xl mx-auto px-4 pb-20">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Privacy Policy
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        This Privacy Policy explains how Smriti AI collects, uses, and protects
        your personal information. By using our services, you agree to the terms
        of this policy.
      </p>

      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        1. Information We Collect
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        We may collect information such as your name, email address, and usage
        data to improve your experience and provide our services.
      </p>

      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        2. How We Use Your Information
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Your data helps us personalize your experience, analyze usage trends,
        and improve our features. We do not sell your personal data to third
        parties.
      </p>

      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        3. Data Security
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        We implement appropriate security measures to protect your data from
        unauthorized access, disclosure, or loss.
      </p>

      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        4. Your Rights
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        You have the right to access, correct, or delete your personal
        information. You can contact us for any data-related requests.
      </p>

      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        5. Contact Us
      </h2>
      <p className="text-gray-700 dark:text-gray-300">
        If you have any questions or concerns about this Privacy Policy, please
        reach out to us through our support page.
      </p>
    </div>
  );
}
