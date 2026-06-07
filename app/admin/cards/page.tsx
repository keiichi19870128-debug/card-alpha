import Link from "next/link";
import { getDb } from "@/lib/db";
import { deleteCard } from "@/lib/actions/admin";

export default async function AdminCardsPage() {
  const { rows: cards } = await getDb().query(
    "SELECT * FROM cards ORDER BY created_at DESC"
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">カード管理</h2>
        <Link href="/admin/cards/new"
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
          + 新規登録
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="pb-3 pr-4">画像</th>
              <th className="pb-3 pr-4">カード名</th>
              <th className="pb-3 pr-4">価格</th>
              <th className="pb-3 pr-4">評価</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody>
            {cards.map((c: any) => (
              <tr key={c.id} className="border-b border-border/50 hover:bg-surface-hover transition-colors">
                <td className="py-3 pr-4">
                  <div className="h-10 w-8 rounded bg-surface-hover flex items-center justify-center text-sm">🃏</div>
                </td>
                <td className="py-3 pr-4 font-medium max-w-[150px] truncate">{c.name}</td>
                <td className="py-3 pr-4">{c.current_price.toLocaleString()}円</td>
                <td className="py-3 pr-4">
                  <span className={`rounded px-1.5 py-0.5 text-xs font-bold ${
                    c.rating === "S" ? "bg-yellow-500/20 text-yellow-400" :
                    c.rating === "A" ? "bg-green-500/20 text-green-400" :
                    "bg-blue-500/20 text-blue-400"
                  }`}>
                    {c.rating}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/cards/${c.id}/edit`}
                      className="rounded px-2 py-1 text-xs font-medium border border-border hover:bg-surface-hover transition-colors">
                      編集
                    </Link>
                    <form action={async () => { "use server"; await deleteCard(c.id); }}>
                      <button type="submit"
                        className="rounded px-2 py-1 text-xs font-medium border border-danger/30 text-danger hover:bg-danger/10 transition-colors">
                        削除
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
