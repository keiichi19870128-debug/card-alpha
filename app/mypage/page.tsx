import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getDb, formatPrice } from "@/lib/db";
import { PortalButton, UpgradeButton } from "@/app/components/UserActions";

export const metadata: Metadata = {
  title: "マイページ",
};

export default async function MyPage() {
  const session = await getServerSession();
  if (!session?.user?.email) redirect("/login");

  const db = getDb();
  const { rows } = await db.query(
    "SELECT id, name, email, is_premium, stripe_customer_id, created_at FROM users WHERE email = $1",
    [session.user.email]
  );
  const user = rows[0];
  if (!user) redirect("/login");

  // Watchlist
  const { rows: watchlist } = await db.query(
    `SELECT w.id, w.card_id, c.name, c.current_price, c.rating
     FROM watchlists w JOIN cards c ON c.id = w.card_id
     WHERE w.user_id = $1 ORDER BY w.created_at DESC`,
    [user.id]
  );

  // Alerts
  const { rows: alerts } = await db.query(
    `SELECT pa.id, pa.target_price, pa.condition, pa.is_active, pa.triggered_at,
            c.name as card_name, c.current_price
     FROM price_alerts pa JOIN cards c ON c.id = pa.card_id
     WHERE pa.user_id = $1 ORDER BY pa.created_at DESC`,
    [user.id]
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight">マイページ</h1>

      {/* Profile & Plan */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="font-bold mb-4">プロフィール</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">ニックネーム</dt>
              <dd>{user.name || "未設定"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">メールアドレス</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">登録日</dt>
              <dd>{new Date(user.created_at).toLocaleDateString("ja-JP")}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="font-bold mb-4">プラン</h2>
          {user.is_premium ? (
            <div>
              <div className="inline-flex items-center rounded-full bg-accent/20 text-accent px-3 py-1 text-sm font-bold mb-4">
                PREMIUM
              </div>
              <p className="text-sm text-muted mb-4">プレミアム会員です。全てのコンテンツにアクセスできます。</p>
              <PortalButton />
            </div>
          ) : (
            <div>
              <div className="inline-flex items-center rounded-full bg-surface-hover text-muted px-3 py-1 text-sm font-bold mb-4">
                FREE
              </div>
              <p className="text-sm text-muted mb-4">無料プランです。一部コンテンツが制限されています。</p>
              <UpgradeButton />
            </div>
          )}
        </div>
      </div>

      {/* Watchlist */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">ウォッチリスト</h2>
        {watchlist.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-6 text-center text-sm text-muted">
            ウォッチリストにカードがありません。<br />
            <Link href="/cards" className="text-primary hover:underline mt-2 inline-block">
              注目カードを見る →
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {watchlist.map((item: any) => (
              <Link key={item.id} href={`/cards/${item.card_id}`}
                className="rounded-xl border border-border bg-surface p-4 hover:border-primary/30 transition-colors">
                <div className="font-semibold text-sm">{item.name}</div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-primary font-bold text-sm">{formatPrice(item.current_price)}</span>
                  <span className={`text-xs font-bold rounded px-1.5 py-0.5 ${
                    item.rating === "S" ? "bg-yellow-500/20 text-yellow-400" :
                    item.rating === "A" ? "bg-green-500/20 text-green-400" :
                    "bg-blue-500/20 text-blue-400"
                  }`}>{item.rating}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Price Alerts */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">価格アラート</h2>
        {alerts.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-6 text-center text-sm text-muted">
            アラートが設定されていません。<br />
            カード詳細ページからアラートを設定できます。
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="pb-2 pr-4">カード</th>
                  <th className="pb-2 pr-4">現在価格</th>
                  <th className="pb-2 pr-4">目標価格</th>
                  <th className="pb-2 pr-4">条件</th>
                  <th className="pb-2">ステータス</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((a: any) => (
                  <tr key={a.id} className="border-b border-border/50">
                    <td className="py-2 pr-4 font-medium">{a.card_name}</td>
                    <td className="py-2 pr-4">{formatPrice(a.current_price)}</td>
                    <td className="py-2 pr-4 font-semibold text-primary">{formatPrice(a.target_price)}</td>
                    <td className="py-2 pr-4">{a.condition === "below" ? "以下" : "以上"}</td>
                    <td className="py-2">
                      {a.triggered_at ? (
                        <span className="rounded-full bg-green-500/20 text-green-400 px-2 py-0.5 text-xs font-bold">発火済み</span>
                      ) : a.is_active ? (
                        <span className="rounded-full bg-blue-500/20 text-blue-400 px-2 py-0.5 text-xs font-bold">監視中</span>
                      ) : (
                        <span className="rounded-full bg-surface-hover text-muted px-2 py-0.5 text-xs">無効</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
