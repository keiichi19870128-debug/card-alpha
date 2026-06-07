import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold">Card Alpha</h3>
            <p className="mt-2 text-sm text-muted">
              カード市場で、一歩先を読む。<br />
              ポケモンカード投資・分析プラットフォーム
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">サイトマップ</h4>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/", label: "ホーム" },
                { href: "/strategies", label: "予算別戦略" },
                { href: "/cards", label: "注目カード" },
                { href: "/articles", label: "記事" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">法的情報</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-sm hover:text-foreground transition-colors">利用規約</Link></li>
              <li><Link href="#" className="text-sm hover:text-foreground transition-colors">プライバシーポリシー</Link></li>
              <li><Link href="#" className="text-sm hover:text-foreground transition-colors">お問い合わせ</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted">
          &copy; {new Date().getFullYear()} Card Alpha. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
