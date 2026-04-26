import { marked } from "marked";
import type { CraftBlock } from "@/lib/craft";

marked.setOptions({
  gfm: true,
  breaks: false,
});

function renderInlineMarkdown(md: string): string {
  const html = marked.parseInline(md) as string;
  return html;
}

interface GroupedBlock {
  type: "single";
  block: CraftBlock;
}

interface GroupedList {
  type: "list";
  blocks: CraftBlock[];
}

type Grouped = GroupedBlock | GroupedList;

function groupBlocks(blocks: CraftBlock[]): Grouped[] {
  const groups: Grouped[] = [];
  let currentList: CraftBlock[] = [];

  for (const block of blocks) {
    if (block.listStyle === "bullet") {
      currentList.push(block);
    } else {
      if (currentList.length > 0) {
        groups.push({ type: "list", blocks: currentList });
        currentList = [];
      }
      groups.push({ type: "single", block });
    }
  }
  if (currentList.length > 0) {
    groups.push({ type: "list", blocks: currentList });
  }

  return groups;
}

function renderBlock(block: CraftBlock): string {
  if (block.type === "image" && block.url) {
    return `<figure class="my-10"><img src="${block.url}" alt="" class="w-full rounded" loading="lazy" /></figure>`;
  }

  const md = block.markdown || "";

  // Skip empty blocks
  if (!md.trim()) return "";

  // Strip leading markdown heading syntax — we use textStyle for semantics
  const textContent = md.replace(/^#{1,6}\s*/, "");
  const inline = renderInlineMarkdown(textContent);

  // Quoted blocks
  if (block.decorations?.includes("quote")) {
    const quoteText = textContent.replace(/^>\s*/, "");
    return `<blockquote class="border-l-2 border-stone-300 pl-6 my-10 text-lg italic text-stone-500">${renderInlineMarkdown(quoteText)}</blockquote>`;
  }

  // Headings
  if (block.textStyle === "h1") {
    return `<h1 class="text-3xl font-semibold mt-14 mb-4">${inline}</h1>`;
  }
  if (block.textStyle === "h2") {
    return `<h2 class="text-2xl font-semibold mt-12 mb-4">${inline}</h2>`;
  }
  if (block.textStyle === "h3") {
    return `<h3 class="text-xl font-semibold mt-10 mb-3">${inline}</h3>`;
  }

  // Regular paragraph
  return `<p class="my-5 leading-relaxed">${inline}</p>`;
}

function renderListItem(block: CraftBlock): string {
  const md = block.markdown || "";
  const textContent = md.replace(/^-\s*/, "");
  return `<li class="leading-relaxed">${renderInlineMarkdown(textContent)}</li>`;
}

export function renderContent(blocks: CraftBlock[]): string {
  const groups = groupBlocks(blocks);
  const parts: string[] = [];

  for (const group of groups) {
    if (group.type === "list") {
      const items = group.blocks.map(renderListItem).join("\n");
      parts.push(
        `<ul class="my-6 ml-6 space-y-2 list-disc marker:text-stone-400">${items}</ul>`
      );
    } else {
      parts.push(renderBlock(group.block));
    }
  }

  return parts.join("\n");
}
