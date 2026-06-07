import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) redirect("/admin/login");

  const nav = [
    { href: "/admin", label: "ダッシュボード" },
    { href: "/admin/articles", label: "記事管理" },
    { href: "/admin/cards", label: "カード管理" },
    { href: "/admin/strategies", label: "戦略管理" },
    { href: "/admin/prices", label: "価格管理" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold">管理画面</h1>
        <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
          ← サイトトップ
        </Link>
      </div>
      <nav className="flex flex-wrap gap-2 mb-8">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-primary/30 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
