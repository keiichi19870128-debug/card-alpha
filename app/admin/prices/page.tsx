import { getDb } from "@/lib/db";
import { recordPrice } from "@/lib/actions/admin";

export default async function AdminPricesPage() {
  const db = getDb();
  const { rows: cards } = await db.query(
    "SELECT id, name, current_price, rating FROM cards WHERE status = 'active' ORDER BY name"
  );
  const { rows: recentPrices } = await db.query(
    `SELECT ph.id, ph.price, ph.recorded_at, ph.source, c.name as card_name
     FROM price_histories ph
     JOIN cards c ON c.id = ph.card_id
     ORDER BY ph.recorded_at DESC LIMIT 20`
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">価格管理</h2>

      {/* 価格登録フォーム */}
      <div className="rounded-xl border border-border bg-surface p-6 mb-8">
        <h3 className="font-semibold mb-4">価格を記録する</h3>
        <form action={async (formData: FormData) => {
          "use server";
          await recordPrice({
            cardId: formData.get("cardId") as string,
            price: parseInt(formData.get("price") as string, 10),
            source: (formData.get("source") as string) || undefined,
          });
        }}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">カード</label>
              <select name="cardId" required
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">選択してください</option>
                {cards.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.rating}) - 現在¥{c.current_price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">価格（円）</label>
              <input name="price" type="number" required min="0"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="120000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">ソース</label>
              <input name="source" type="text"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="メルカリ / カードショップ等" />
            </div>
            <div className="flex items-end">
              <button type="submit"
                className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
                記録する
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 一括登録 */}
      <div className="rounded-xl border border-border bg-surface p-6 mb-8">
        <h3 className="font-semibold mb-4">一括価格更新</h3>
        <p className="text-sm text-muted mb-4">全カードの現在価格をまとめて記録します（日次運用向け）</p>
        <form action={async () => {
          "use server";
          const db = (await import("@/lib/db")).getDb();
          const { rows } = await db.query("SELECT id, current_price FROM cards WHERE status = 'active'");
          for (const card of rows) {
            await recordPrice({ cardId: card.id, price: card.current_price, source: "daily-snapshot" });
          }
        }}>
          <button type="submit"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface-hover transition-colors">
            全カードの現在価格をスナップショット保存
          </button>
        </form>
      </div>

      {/* 最近の価格履歴 */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h3 className="font-semibold mb-4">最近の価格記録</h3>
        {recentPrices.length === 0 ? (
          <p className="text-sm text-muted">まだ価格履歴がありません</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="pb-2 pr-4">カード</th>
                  <th className="pb-2 pr-4">価格</th>
                  <th className="pb-2 pr-4">ソース</th>
                  <th className="pb-2">記録日</th>
                </tr>
              </thead>
              <tbody>
                {recentPrices.map((p: any) => (
                  <tr key={p.id} className="border-b border-border/50">
                    <td className="py-2 pr-4">{p.card_name}</td>
                    <td className="py-2 pr-4 font-semibold text-primary">¥{p.price.toLocaleString()}</td>
                    <td className="py-2 pr-4 text-muted">{p.source || "-"}</td>
                    <td className="py-2 text-muted">{new Date(p.recorded_at).toLocaleDateString("ja-JP")}</td>
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
