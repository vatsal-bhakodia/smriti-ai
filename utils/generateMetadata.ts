import type { Metadata, Viewport } from "next";

export interface PageMetadata {
  title: string;
  description?: string;
  keywords?: string[];
  url?: string;
  image?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  themeColor?: string;
}

export function generateMetadataUtil(pageData: PageMetadata): Metadata {
  const baseTitle = "Smriti AI";
  const defaultDescription =
    "Smriti AI is an online learning platform which helps you to learn faster and remember better. Turn any PDF, YouTube video, into AI-powered flashcards, summaries, and mind maps instantly.";
  const defaultImage = "/opengraph-image.png";
  const siteUrl = "https://www.smriti.live/";

  const fullTitle =
    pageData.title === baseTitle ||
    pageData.title.toLowerCase().includes(baseTitle.toLowerCase())
      ? pageData.title
      : `${pageData.title} | ${baseTitle}`;

  const description = pageData.description || defaultDescription;
  const image = pageData.image || defaultImage;
  const url = pageData.url || siteUrl;
  const ogTitle = pageData.ogTitle || fullTitle;
  const ogDescription = pageData.ogDescription || description;
  const twitterTitle = pageData.twitterTitle || fullTitle;
  const twitterDescription = pageData.twitterDescription || description;

  return {
    title: fullTitle,
    description,
    keywords: pageData.keywords || [
      "smriti ai",
      "ai tutor",
      "ai tool",
      "online learning platform",
    ],
    applicationName: baseTitle,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url,
      siteName: baseTitle,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: [image],
    },
    appleWebApp: {
      title: baseTitle,
    },
  };
}

export function generateViewport(pageData?: PageMetadata): Viewport {
  const defaultThemeColor = "#adff2f";
  const themeColor = pageData?.themeColor || defaultThemeColor;

  return {
    themeColor: themeColor,
  };
}
