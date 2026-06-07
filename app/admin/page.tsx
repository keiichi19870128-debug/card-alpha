import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const isAdmin = await requireAdmin();
  if (!isAdmin) redirect("/admin/login");

  const { getDb } = await import("@/lib/db");
  const db = getDb();

  // Counts
  const articleCount = parseInt((await db.query("SELECT COUNT(*) as c FROM articles")).rows[0].c, 10);
  const cardCount = parseInt((await db.query("SELECT COUNT(*) as c FROM cards WHERE status = 'active'")).rows[0].c, 10);
  const strategyCount = parseInt((await db.query("SELECT COUNT(*) as c FROM budget_strategies")).rows[0].c, 10);
  const userCount = parseInt((await db.query("SELECT COUNT(*) as c FROM users")).rows[0].c, 10);
  const premiumCount = parseInt((await db.query("SELECT COUNT(*) as c FROM users WHERE is_premium = true")).rows[0].c, 10);
  const priceHistoryCount = parseInt((await db.query("SELECT COUNT(*) as c FROM price_histories")).rows[0].c, 10);

  // Total page views (sum of article view_count)
  const totalViews = parseInt((await db.query("SELECT COALESCE(SUM(view_count), 0) as c FROM articles")).rows[0].c, 10);

  // Recent registrations (last 7 days)
  const { rows: recentUsers } = await db.query(
    "SELECT COUNT(*) as c FROM users WHERE created_at >= NOW() - INTERVAL '7 days'"
  );
  const newUsersWeek = parseInt(recentUsers[0].c, 10);

  // Top articles by views
  const { rows: topArticles } = await db.query(
    "SELECT id, title, view_count FROM articles WHERE is_published = true ORDER BY view_count DESC LIMIT 5"
  );

  // Recent cards
  const { rows: recentCards } = await db.query(
    "SELECT id, name, rating, current_price FROM cards WHERE status = 'active' ORDER BY created_at DESC LIMIT 5"
  );

  // Price alerts stats
  const activeAlerts = parseInt((await db.query("SELECT COUNT(*) as c FROM price_alerts WHERE is_active = true")).rows[0].c, 10);

  const menu = [
    { href: "/admin/articles", label: "記事管理", desc: "記事の作成・編集・削除", count: articleCount, icon: "📝" },
    { href: "/admin/cards", label: "カード管理", desc: "注目カードの登録・編集", count: cardCount, icon: "🃏" },
    { href: "/admin/strategies", label: "戦略管理", desc: "予算別戦略の編集", count: strategyCount, icon: "📊" },
    { href: "/admin/prices", label: "価格管理", desc: "価格履歴の記録・管理", count: priceHistoryCount, icon: "💰" },
  ];

  return (
    <div>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 mb-8">
        <StatCard label="総PV" value={totalViews.toLocaleString()} />
        <StatCard label="会員数" value={userCount.toString()} />
        <StatCard label="有料会員" value={premiumCount.toString()} highlight />
        <StatCard label="新規(7日)" value={newUsersWeek.toString()} />
        <StatCard label="カード数" value={cardCount.toString()} />
        <StatCard label="アラート" value={activeAlerts.toString()} />
      </div>

      {/* Quick Navigation */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {menu.map((m) => (
          <Link key={m.href} href={m.href}
            className="rounded-xl border border-border bg-surface p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{m.icon}</span>
              <div>
                <div className="text-2xl font-extrabold text-primary">{m.count}</div>
                <div className="text-sm font-semibold">{m.label}</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted">{m.desc}</div>
          </Link>
        ))}
      </div>

      {/* Details */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Top Articles */}
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-bold mb-4">人気記事 TOP5</h2>
          {topArticles.length === 0 ? (
            <p className="text-sm text-muted">まだ記事がありません</p>
          ) : (
            <ul className="space-y-3">
              {topArticles.map((a: any, i: number) => (
                <li key={a.id} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-sm truncate flex-1">{a.title}</span>
                  <span className="text-xs text-muted shrink-0">{a.view_count} PV</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Cards */}
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-bold mb-4">最近追加されたカード</h2>
          <ul className="space-y-3">
            {recentCards.map((c: any) => (
              <li key={c.id} className="flex items-center justify-between">
                <span className="text-sm truncate">{c.name}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold text-primary">
                    ¥{c.current_price.toLocaleString()}
                  </span>
                  <span className={`text-xs font-bold rounded px-1.5 py-0.5 ${
                    c.rating === "S" ? "bg-yellow-500/20 text-yellow-400" :
                    c.rating === "A" ? "bg-green-500/20 text-green-400" :
                    "bg-blue-500/20 text-blue-400"
                  }`}>
                    {c.rating}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 text-center">
      <div className={`text-xl font-extrabold ${highlight ? "text-accent" : "text-primary"}`}>{value}</div>
      <div className="mt-1 text-xs text-muted">{label}</div>
    </div>
  );
}
