import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Personal Blog",
    template: "%s — Personal Blog",
  },
  description:
    "Reflections on design, architecture, craft, and the objects that shape our lives.",
};

function Header() {
  return (
    <header className="border-b border-stone-200">
      <div className="max-w-2xl mx-auto px-6 py-6 flex items-baseline justify-between">
        <Link href="/" className="text-xl font-semibold no-underline tracking-tight">
          Personal Blog
        </Link>
        <nav className="flex gap-6 text-sm font-sans">
          <Link href="/archive" className="text-ink-muted hover:text-ink no-underline">
            Archive
          </Link>
          <Link href="/search" className="text-ink-muted hover:text-ink no-underline">
            Search
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-stone-200 mt-24">
      <div className="max-w-2xl mx-auto px-6 py-8 text-sm text-stone-500 font-sans">
        © {new Date().getFullYear()}
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="max-w-2xl mx-auto px-6 py-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
