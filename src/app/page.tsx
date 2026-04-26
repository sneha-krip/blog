import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/craft";

export default async function Home() {
  const posts = await getAllPosts();
  const recent = posts.slice(0, 3);

  return (
    <div>
      <section className="mb-20">
        <h1 className="text-4xl font-semibold tracking-tight mb-3">
          Personal Blog
        </h1>
        <p className="text-lg text-stone-500 leading-relaxed max-w-lg">
          Reflections on design, architecture, craft, and the objects that shape
          our lives.
        </p>
      </section>

      <section>
        <h2 className="text-sm font-sans font-medium uppercase tracking-widest text-stone-400 mb-10">
          Recent Posts
        </h2>

        <div className="space-y-16">
          {recent.map((post) => (
            <article key={post.id}>
              <time className="text-sm font-sans text-stone-400 block mb-2">
                {formatDate(post.date)}
              </time>
              <h3 className="text-2xl font-semibold mb-3 leading-snug">
                <Link href={`/posts/${post.slug}`} className="no-underline hover:underline">
                  {post.title}
                </Link>
              </h3>
              <p className="text-stone-600 leading-relaxed">{post.blurb}</p>
              {post.tags.length > 0 && (
                <div className="flex gap-2 mt-4">
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
            </article>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-stone-200">
          <Link
            href="/archive"
            className="text-sm font-sans font-medium text-ink-muted hover:text-ink"
          >
            View all posts →
          </Link>
        </div>
      </section>
    </div>
  );
}
