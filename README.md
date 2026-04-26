# Personal Blog

A static blog built with Next.js that fetches content from Craft documents.

## Development

```bash
npm install
npm run dev    # Start dev server at http://localhost:3000
npm run build  # Build static export to out/
```

## Architecture

- **Content source**: Craft document API — posts are fetched at build time
- **Static export**: All pages pre-rendered as static HTML
- **Search**: Client-side filtering over pre-built post index
