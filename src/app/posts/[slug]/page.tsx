import Link from "next/link";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/craft";
import { renderContent } from "@/lib/renderer";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.title,
    description: post.blurb,
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const posts = await getAllPosts();
  const postIndex = posts.findIndex((p) => p.slug === slug);
  const post = posts[postIndex];

  if (!post) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-semibold mb-4">Post not found</h1>
        <Link href="/" className="text-sm font-sans text-ink-muted">
          ← Back to home
        </Link>
      </div>
    );
  }

  // Newer post = lower index (sorted newest first)
  const newerPost = postIndex > 0 ? posts[postIndex - 1] : null;
  const olderPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;

  const html = renderContent(post.content);

  return (
    <article>
      <header className="mb-12">
        <time className="text-sm font-sans text-stone-400 block mb-3">
          {formatDate(post.date)}
        </time>
        <h1 className="text-4xl font-semibold tracking-tight leading-tight mb-5">
          {post.title}
        </h1>
        {post.tags.length > 0 && (
          <div className="flex gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="text-xs font-sans px-2.5 py-1 rounded-full bg-cream-dark text-stone-500 no-underline hover:text-ink"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div
        className="prose-blog"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <nav className="mt-20 pt-8 border-t border-stone-200 grid grid-cols-2 gap-8 text-sm font-sans">
        <div>
          {olderPost && (
            <Link
              href={`/posts/${olderPost.slug}`}
              className="no-underline text-stone-500 hover:text-ink group"
            >
              <span className="text-xs uppercase tracking-widest text-stone-400 block mb-1">
                ← Older
              </span>
              <span className="group-hover:underline">{olderPost.title}</span>
            </Link>
          )}
        </div>
        <div className="text-right">
          {newerPost && (
            <Link
              href={`/posts/${newerPost.slug}`}
              className="no-underline text-stone-500 hover:text-ink group"
            >
              <span className="text-xs uppercase tracking-widest text-stone-400 block mb-1">
                Newer →
              </span>
              <span className="group-hover:underline">{newerPost.title}</span>
            </Link>
          )}
        </div>
      </nav>
    </article>
  );
}
