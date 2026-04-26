import Link from "next/link";
import { getAllTags, getPostsByTag, formatDate } from "@/lib/craft";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `Posts tagged "${tag}"`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight mb-2">
        Posts tagged &ldquo;{tag}&rdquo;
      </h1>
      <p className="text-sm font-sans text-stone-400 mb-12">
        {posts.length} {posts.length === 1 ? "post" : "posts"}
      </p>

      <div className="space-y-12">
        {posts.map((post) => (
          <article key={post.id}>
            <time className="text-sm font-sans text-stone-400 block mb-2">
              {formatDate(post.date)}
            </time>
            <h2 className="text-xl font-semibold mb-2 leading-snug">
              <Link
                href={`/posts/${post.slug}`}
                className="no-underline hover:underline"
              >
                {post.title}
              </Link>
            </h2>
            <p className="text-stone-600 leading-relaxed">{post.blurb}</p>
          </article>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-stone-200">
        <Link
          href="/archive"
          className="text-sm font-sans font-medium text-ink-muted hover:text-ink"
        >
          ← All posts
        </Link>
      </div>
    </div>
  );
}
