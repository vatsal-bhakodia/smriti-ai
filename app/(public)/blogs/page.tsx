import BlogCard from "@/components/blog/BlogCard";
import { getAllBlogPosts } from "@/lib/blog";
import { generateMetadataUtil } from "@/utils/generateMetadata";

export const metadata = generateMetadataUtil({
  title: "Blog",
  description:
    "Discover the latest insights, tips, and strategies for smarter learning with AI. Read our blog for study techniques, productivity hacks, and educational technology updates.",
  keywords: [
    "Smriti AI Blog",
    "learning blog",
    "study tips",
    "AI education",
    "productivity blog",
    "learning strategies",
    "educational technology",
    "study techniques",
    "memory retention tips",
    "AI learning insights",
  ],
  url: "https://www.smriti.live/blogs",
});

export default async function BlogsPage() {
  const posts = await getAllBlogPosts();

  return (
    <section className="max-w-7xl mx-auto pb-32 px-6">
      <h1 className="text-3xl font-bold mb-8">Blogs</h1>
      {/* 1 col on mobile, 2 on md, 3 on lg+ */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard
            key={post.slug}
            title={post.title}
            slug={post.slug}
            coverImage={post.featureImage?.url} // comes from lib/blog.ts
            author={post.author}
            date={post.publishDate}
            excerpt={post.summary}
          />
        ))}
      </div>
    </section>
  );
}
