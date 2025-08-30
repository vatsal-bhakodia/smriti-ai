import BlogCard from "@/components/blog/BlogCard";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";
import Footer from "@/components/Footer";

export default async function BlogsPage() {
  //the below line is commented out to use dummy data for layout testing
  //when using real data, uncomment it

  const posts = await getAllBlogPosts();

  //dummy posts for layout testing

  // const posts = [
  //   {
  //     title: "Sample Blog Post",
  //     slug: "sample-blog",
  //     featureImage: { url: "https://via.placeholder.com/600x400" },
  //     author: "John Doe",
  //     publishDate: new Date().toISOString(),
  //     summary: "This is a test excerpt for the blog layout.",
  //   },
  //   {
  //     title: "Another Post",
  //     slug: "another-post",
  //     featureImage: { url: "https://via.placeholder.com/600x400" },
  //     author: "Jane Smith",
  //     publishDate: new Date().toISOString(),
  //     summary: "Second test excerpt, to check grid responsiveness.",
  //   },
  // ];

  //above data is dummy data for layout testing

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
            coverImage={post.featureImage?.url}  // comes from lib/blog.ts
            author={post.author}
            date={post.publishDate}
            excerpt={post.summary}
          />
        ))}
      </div>

      {/* <div className="space-y-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="border rounded-lg p-4 flex flex-col md:flex-row gap-4"
          >
            <div>
              <h2 className="text-xl font-semibold">
                <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                By {post.author} •{" "}
                {new Date(post.publishDate).toLocaleDateString()}
              </p>
              <p className="mb-2">{post.summary}</p>
              <Link
                href={`/blogs/${post.slug}`}
                className="text-blue-600 hover:underline"
              >
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </div> */}
    </section>
  );
}
