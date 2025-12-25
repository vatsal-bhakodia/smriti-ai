import { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getAllBlogPosts } from "@/lib/blog";
import { toolsData } from "@/content/tools";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const BASE = `${protocol}://${host}`;

  // Static public routes
  const staticPaths = [
    "/", // Home
    "/about",
    "/contributors",
    "/blogs",
    "/contact",
    "/privacy-policy",
    "/terms-of-use",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: new URL(p, BASE).toString(),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: p === "/" ? 1 : 0.8,
  }));

  // Dynamic blog post routes
  const posts = await getAllBlogPosts(); // returns BlogPost[] (slug, publishDate, etc.)
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: new URL(`/blogs/${post.slug}`, BASE).toString(),
    lastModified: post.publishDate ? new Date(post.publishDate) : new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Dynamic tool pages
  const toolEntries: MetadataRoute.Sitemap = Object.values(toolsData).map(
    (tool) => ({
      url: new URL(`/tools/${tool.slug}`, BASE).toString(),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    })
  );

  return [...staticEntries, ...blogEntries, ...toolEntries];
}
