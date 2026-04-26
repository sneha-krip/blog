const API_BASE = "https://connect.craft.do/links/G9Avs8dLnSu/api/v1";
const COLLECTION_ID = "66822611-8C7C-4EE0-AA37-D03AFC39D0FB";

// --- Types ---

export interface CraftBlock {
  id: string;
  type: string;
  textStyle?: string;
  listStyle?: string;
  decorations?: string[];
  markdown?: string;
  url?: string;
  content?: CraftBlock[];
}

export interface PostProperties {
  blurb?: string;
  published?: boolean;
  date?: string;
  tags?: string[];
}

export interface CraftCollectionItem {
  id: string;
  title: string;
  properties: PostProperties;
  content?: CraftBlock[];
  contentPreviewMd?: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  blurb: string;
  date: string;
  tags: string[];
  content: CraftBlock[];
}

// --- Helpers ---

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function makeSlug(title: string, id: string): string {
  return `${slugify(title)}-${id.slice(0, 8).toLowerCase()}`;
}

// --- API ---

async function fetchCollectionItems(
  withContent: boolean = true
): Promise<CraftCollectionItem[]> {
  const url = `${API_BASE}/collections/${COLLECTION_ID}/items${
    withContent ? "" : "?maxDepth=0"
  }`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: false },
  });
  if (!res.ok) {
    throw new Error(`Craft API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data.items;
}

function itemToPost(item: CraftCollectionItem): Post | null {
  if (!item.properties.published) return null;
  if (!item.properties.date) return null;

  return {
    id: item.id,
    slug: makeSlug(item.title, item.id),
    title: item.title,
    blurb: item.properties.blurb || "",
    date: item.properties.date,
    tags: (item.properties.tags || []).map((t) => t.toLowerCase().trim()),
    content: item.content || [],
  };
}

export async function getAllPosts(): Promise<Post[]> {
  const items = await fetchCollectionItems(true);
  const posts = items
    .map(itemToPost)
    .filter((p): p is Post => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug);
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.tags.includes(tag));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
