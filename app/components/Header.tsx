"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";

const navLinks = [
  { href: "/", label: "ホーム" },
  { href: "/strategies", label: "予算別戦略" },
  { href: "/cards", label: "注目カード" },
  { href: "/rankings", label: "ランキング" },
  { href: "/articles", label: "記事" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-sm font-black">
              A
            </span>
            <span>Card Alpha</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-surface-hover hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {session?.user ? (
              <Link href="/mypage"
                className="ml-2 rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
                マイページ
              </Link>
            ) : (
              <Link href="/login"
                className="ml-2 rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
                ログイン
              </Link>
            )}
          </nav>

          <button
            className="md:hidden rounded-md p-2 text-muted hover:bg-surface-hover"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="メニュー"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden border-t border-border pb-4 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-surface-hover hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {session?.user ? (
              <Link href="/mypage" onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-primary">
                マイページ
              </Link>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-primary">
                ログイン
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
