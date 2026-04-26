"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SearchablePost {
  slug: string;
  title: string;
  blurb: string;
  date: string;
  tags: string[];
  textContent: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function SearchClient({
  posts,
}: {
  posts: SearchablePost[];
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchablePost[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const filtered = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.blurb.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)) ||
        p.textContent.toLowerCase().includes(q)
    );
    setResults(filtered);
  }, [query, posts]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search posts…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-3 text-lg bg-cream-dark border border-stone-200 rounded-lg
                   focus:outline-none focus:border-ink-muted focus:ring-1 focus:ring-ink-muted
                   placeholder:text-stone-400 font-serif"
        autoFocus
      />

      {query.trim() && (
        <p className="text-sm font-sans text-stone-400 mt-4 mb-8">
          {results.length} {results.length === 1 ? "result" : "results"}
        </p>
      )}

      <div className="space-y-12 mt-8">
        {results.map((post) => (
          <article key={post.slug}>
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
    </div>
  );
}
