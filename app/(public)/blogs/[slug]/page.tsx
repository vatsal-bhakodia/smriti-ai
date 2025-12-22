import { getBlogPostBySlug } from "@/lib/blog";
import Image from "next/image";
import { notFound } from "next/navigation";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { Metadata } from "next";
import { generateMetadataUtil } from "@/utils/generateMetadata";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// for indivisual blog post metadata generation
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return generateMetadataUtil({
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
      url: `https://www.smriti.live/blogs/${slug}`,
    });
  }

  // Extract keywords from the post content or use defaults
  const defaultKeywords = [
    "Smriti AI",
    "learning",
    "study tips",
    "AI education",
    "productivity",
    "educational technology",
  ];

  const titleWords = post.title
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 3)
    .slice(0, 5);

  const keywords = [...titleWords, ...defaultKeywords];

  return generateMetadataUtil({
    title: post.title,
    description:
      post.summary ||
      `Read "${post.title}" on Smriti AI blog. Discover insights about learning, productivity, and AI-powered education.`,
    keywords,
    url: `https://smriti.ai/blogs/${slug}`,
    image: post.featureImage?.url || "/og-image.png",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return notFound();

  return (
    <main className="max-w-2xl mx-auto pt-14 pb-24 px-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-500 text-sm mb-4">
        By {post.author} • {new Date(post.publishDate).toLocaleDateString()}
      </p>
      {post.featureImage?.url && (
        <div className="relative w-full h-64 mb-6">
          <Image
            src={post.featureImage.url}
            alt={post.featureImage.description || post.title}
            fill
            sizes="(min-width: 640px) 42rem, 100vw"
            className="object-cover rounded"
          />
        </div>
      )}

      <div className="prose prose-lg">
        {documentToReactComponents(post.content)}
      </div>
    </main>
  );
}
