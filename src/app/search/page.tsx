import { getAllPosts } from "@/lib/craft";
import type { CraftBlock } from "@/lib/craft";
import SearchClient from "@/components/SearchClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
};

function extractText(blocks: CraftBlock[]): string {
  const parts: string[] = [];
  for (const block of blocks) {
    if (block.markdown) {
      parts.push(
        block.markdown
          .replace(/[#>*_\[\]()!`]/g, "")
          .replace(/\s+/g, " ")
          .trim()
      );
    }
    if (block.content) {
      parts.push(extractText(block.content));
    }
  }
  return parts.join(" ");
}

export default async function SearchPage() {
  const posts = await getAllPosts();

  const searchablePosts = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    blurb: p.blurb,
    date: p.date,
    tags: p.tags,
    textContent: extractText(p.content),
  }));

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight mb-8">Search</h1>
      <SearchClient posts={searchablePosts} />
    </div>
  );
}
