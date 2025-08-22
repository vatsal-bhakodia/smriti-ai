import type { Metadata } from "next";

type PageMetadata = {
    title?: string;
    description?: string;
    keywords?: string[];
};

/**
 * Default metadata values
 */
const defaultMetadata: PageMetadata = {
    title: "Smriti AI",
    description: "Smriti AI - Remember Smarter",
    keywords: ["Smriti AI", "learning", "AI", "education", "study", "memory", "notes"],
};

/**
 * Page-specific metadata configurations
 */
const pageMetadata: Record<string, PageMetadata> = {
    home: {
        title: "Smriti AI",
        description: "Transform your learning experience with AI-powered tools that help you study smarter, retain better, and achieve academic excellence.",
        keywords: ["Smriti AI", "learning platform", "AI education", "study tools", "memory enhancement", "academic excellence"],
    },
    about: {
        title: "About Smriti AI | Our Mission & Vision",
        description: "Learn about Smriti AI's mission to democratize learning and make quality education accessible to every learner through AI-powered tools.",
        keywords: ["about Smriti AI", "AI education mission", "learning technology", "education accessibility", "AI learning tools"],
    },
    contact: {
        title: "Contact Smriti AI | Get in Touch",
        description: "Have questions about Smriti AI? Contact our team for support, partnership opportunities, or general inquiries.",
        keywords: ["contact Smriti AI", "AI education support", "learning platform help", "Smriti AI contact", "education technology support"],
    },
    dashboard: {
        title: "Smriti AI Dashboard | Your Learning Hub",
        description: "Access your personalized Smriti AI dashboard to manage your learning materials, track progress, and enhance your study experience.",
        keywords: ["Smriti AI dashboard", "learning management", "study dashboard", "AI education platform", "personalized learning"],
    },
    contributors: {
        title: "Smriti AI Contributors | Our Community",
        description: "Meet the talented developers and contributors who have helped make Smriti AI possible.",
        keywords: ["Smriti AI contributors", "open source contributors", "AI education community", "developers", "open source project"],
    },
    privacyPolicy: {
        title: "Privacy Policy | Smriti AI",
        description: "Learn about how Smriti AI collects, uses, and protects your personal information and data.",
        keywords: ["Smriti AI privacy policy", "data protection", "privacy terms", "user data", "information security"],
    },
    termsOfUse: {
        title: "Terms of Use | Smriti AI",
        description: "Read the terms and conditions for using Smriti AI's learning platform and services.",
        keywords: ["Smriti AI terms", "terms of service", "user agreement", "legal terms", "usage policy"],
    },
    signIn: {
        title: "Sign In | Smriti AI",
        description: "Sign in to your Smriti AI account to access your personalized learning dashboard and tools.",
        keywords: ["Smriti AI login", "sign in", "user account", "learning platform access"],
    },
    signUp: {
        title: "Sign Up | Smriti AI",
        description: "Create your Smriti AI account to start your journey to smarter learning and better retention.",
        keywords: ["Smriti AI signup", "create account", "join learning platform", "new user registration"],
    },
};

/**
 * Generate metadata for a specific page
 * @param pageName - The name of the page to generate metadata for
 * @param customMetadata - Optional custom metadata to override defaults
 * @returns Metadata object for the page
 */
export function generateMetadata(
    pageName: keyof typeof pageMetadata | string,
    customMetadata?: PageMetadata
): Metadata {
    // Get page-specific metadata or default to the default metadata
    const baseMetadata = pageMetadata[pageName as keyof typeof pageMetadata] || defaultMetadata;

    // Merge with any custom metadata provided
    const mergedMetadata = {
        ...baseMetadata,
        ...customMetadata,
    };

    return {
        title: mergedMetadata.title || defaultMetadata.title,
        description: mergedMetadata.description || defaultMetadata.description,
        keywords: mergedMetadata.keywords || defaultMetadata.keywords,
        // Add additional metadata properties as needed
        openGraph: {
            title: mergedMetadata.title || defaultMetadata.title,
            description: mergedMetadata.description || defaultMetadata.description,
            type: "website",
            siteName: "Smriti AI",
        },
        twitter: {
            card: "summary_large_image",
            title: mergedMetadata.title || defaultMetadata.title,
            description: mergedMetadata.description || defaultMetadata.description,
        },
    };
}
