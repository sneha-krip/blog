import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/craft";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Archive",
};

export default async function ArchivePage() {
  const posts = await getAllPosts();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight mb-12">Archive</h1>

      <table className="w-full">
        <thead>
          <tr className="text-left text-xs font-sans uppercase tracking-widest text-stone-400 border-b border-stone-200">
            <th className="pb-3 font-medium">Date</th>
            <th className="pb-3 font-medium">Title</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr
              key={post.id}
              className="border-b border-stone-200/60 hover:bg-cream-dark/50 transition-colors"
            >
              <td className="py-4 pr-8 text-sm font-sans text-stone-400 whitespace-nowrap align-top">
                {formatDate(post.date)}
              </td>
              <td className="py-4">
                <Link
                  href={`/posts/${post.slug}`}
                  className="no-underline hover:underline font-medium"
                >
                  {post.title}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
