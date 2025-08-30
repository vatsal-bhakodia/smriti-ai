import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";

type BlogCardProps = {
    title: string;
    slug: string;
    coverImage?: string;
    author?: string;
    date?: string;      // ISO string is fine
    excerpt?: string;
};

export default function BlogCard({
    title,
    slug,
    coverImage,
    author,
    date,
    excerpt,
}: BlogCardProps) {
    return (
        <div className="rounded-xl overflow-hidden border bg-card shadow-sm hover:shadow-lg transition flex flex-col">
            {/* feature image */}
            <div className="relative aspect-[16/9] bg-muted">
                {coverImage ? (
                    <Image
                        src={coverImage}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
                        No image
                    </div>
                )}
            </div>

            {/* body */}
            <div className="p-4 flex-1 flex flex-col">
                <Link href={`/blogs/${slug}`}>
                    <h3 className="text-lg font-semibold hover:underline line-clamp-2">
                        {title}
                    </h3>
                </Link>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {author && (
                        <span className="inline-flex items-center gap-1">
                            <User size={14} /> {author}
                        </span>
                    )}
                    {date && (
                        <span className="inline-flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(date).toLocaleDateString()}
                        </span>
                    )}
                </div>

                {excerpt && (
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-3 flex-1">
                        {excerpt}
                    </p>
                )}

                <Link
                    href={`/blogs/${slug}`}
                    className="mt-4 text-primary font-medium text-sm hover:underline"
                >
                    Read more →
                </Link>
            </div>
        </div>
    );
}



