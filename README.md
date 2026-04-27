# My Personal Blog

Built with :heart: using [Craft MCP](https://www.craft.do/imagine) and GitHub Copilot.


## Development

```bash
npm install
npm run dev    # Start dev server at http://localhost:3000
npm run build  # Build static export to out/
```

## Architecture

### Data Flow

```
Craft API → lib/craft.ts → pages fetch data at build time → static HTML in out/
```

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/craft.ts` | Fetches posts from the Craft API. All data functions live here: `getAllPosts()`, `getPostsByTag()`, etc. |
| `src/lib/renderer.ts` | Converts Craft content blocks (headings, paragraphs, images, quotes, lists) into HTML. |
| `src/app/layout.tsx` | Shell that wraps every page: header nav, footer, max-width container. |
| `src/app/globals.css` | All colors, fonts, and base styles. |
| `src/app/page.tsx` | Landing page (latest 3 posts). |
| `src/app/archive/page.tsx` | Archive table of all posts. |
| `src/app/posts/[slug]/page.tsx` | Individual post page with prev/next navigation. |
| `src/app/tags/[tag]/page.tsx` | Posts filtered by tag. |
| `src/app/search/page.tsx` | Search page (with `src/components/SearchClient.tsx` for client-side filtering). |

### Style Tweaks

**Colors and fonts** — Edit the `@theme` block in `src/app/globals.css`:

```css
--color-cream: #fbf7f3;     /* background */
--color-ink: #1e4c41;        /* text */
--color-ink-muted: #7a9e93;  /* subtle text/links */
--font-serif: "Iowan Old Style", "Palatino Linotype", serif;
```
