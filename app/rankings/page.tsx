import type { Metadata } from "next";
import Link from "next/link";
import { getDb, formatPrice } from "@/lib/db";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "高騰・下落ランキング",
  description: "ポケモンカードの価格変動ランキング。日次・週次・月次の高騰カード・下落カードを表示します。",
  openGraph: {
    title: "高騰・下落ランキング | Card Alpha",
    description: "ポケモンカードの価格変動ランキング。日次・週次・月次で確認できます。",
  },
};

type RankingCard = {
  id: string;
  name: string;
  rating: string;
  current_price: number;
  previous_price: number;
  change_pct: number;
  change_amount: number;
};

async function getRanking(period: "day" | "week" | "month", direction: "up" | "down"): Promise<RankingCard[]> {
  const db = getDb();
  const daysMap = { day: 1, week: 7, month: 30 };
  const days = daysMap[period];
  const order = direction === "up" ? "DESC" : "ASC";

  const { rows } = await db.query(
    `WITH latest AS (
       SELECT DISTINCT ON (card_id) card_id, price as current_price
       FROM price_histories
       ORDER BY card_id, recorded_at DESC
     ),
     previous AS (
       SELECT DISTINCT ON (card_id) card_id, price as previous_price
       FROM price_histories
       WHERE recorded_at <= NOW() - INTERVAL '${days} days'
       ORDER BY card_id, recorded_at DESC
     )
     SELECT c.id, c.name, c.rating, c.current_price,
            COALESCE(p.previous_price, c.current_price) as previous_price,
            CASE WHEN COALESCE(p.previous_price, c.current_price) > 0
              THEN ROUND(((c.current_price - COALESCE(p.previous_price, c.current_price))::numeric / COALESCE(p.previous_price, c.current_price)::numeric) * 100, 1)
              ELSE 0
            END as change_pct,
            c.current_price - COALESCE(p.previous_price, c.current_price) as change_amount
     FROM cards c
     LEFT JOIN latest l ON l.card_id = c.id
     LEFT JOIN previous p ON p.card_id = c.id
     WHERE c.status = 'active'
       AND COALESCE(p.previous_price, c.current_price) != c.current_price
     ORDER BY change_pct ${order}
     LIMIT 10`
  );
  return rows;
}

function RankingTable({ cards, direction }: { cards: RankingCard[]; direction: "up" | "down" }) {
  if (cards.length === 0) {
    return <p className="text-sm text-muted py-4">データが不足しています。価格履歴を登録してください。</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted">
            <th className="pb-2 pr-2 w-8">#</th>
            <th className="pb-2 pr-4">カード名</th>
            <th className="pb-2 pr-4 text-right">現在価格</th>
            <th className="pb-2 pr-4 text-right">前回価格</th>
            <th className="pb-2 text-right">変動率</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card, i) => (
            <tr key={card.id} className="border-b border-border/50">
              <td className="py-3 pr-2 font-bold text-muted">{i + 1}</td>
              <td className="py-3 pr-4">
                <Link href={`/cards/${card.id}`} className="hover:text-primary transition-colors">
                  <span className="font-medium">{card.name}</span>
                  <span className={`ml-2 text-xs font-bold rounded px-1.5 py-0.5 ${
                    card.rating === "S" ? "bg-yellow-500/20 text-yellow-400" :
                    card.rating === "A" ? "bg-green-500/20 text-green-400" :
                    "bg-blue-500/20 text-blue-400"
                  }`}>
                    {card.rating}
                  </span>
                </Link>
              </td>
              <td className="py-3 pr-4 text-right font-semibold">{formatPrice(card.current_price)}</td>
              <td className="py-3 pr-4 text-right text-muted">{formatPrice(card.previous_price)}</td>
              <td className={`py-3 text-right font-bold ${
                direction === "up" ? "text-green-400" : "text-red-400"
              }`}>
                {direction === "up" ? "+" : ""}{card.change_pct}%
                <span className="block text-xs font-normal text-muted">
                  {direction === "up" ? "+" : ""}{formatPrice(card.change_amount)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function RankingsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const sp = await searchParams;
  const period = (sp.period as "day" | "week" | "month") || "week";

  const [rising, falling] = await Promise.all([
    getRanking(period, "up"),
    getRanking(period, "down"),
  ]);

  const periods = [
    { key: "day", label: "日次" },
    { key: "week", label: "週次" },
    { key: "month", label: "月次" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">高騰・下落ランキング</h1>
      <p className="mt-4 text-lg text-muted">
        価格変動の大きいカードをランキング形式で表示しています。
      </p>

      {/* Period Tabs */}
      <div className="mt-8 flex gap-2">
        {periods.map((p) => (
          <Link
            key={p.key}
            href={`/rankings?period=${p.key}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              period === p.key
                ? "bg-primary/10 text-primary border border-primary/30"
                : "border border-border bg-surface hover:border-primary/30"
            }`}
          >
            {p.label}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* 高騰ランキング */}
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-xs">↑</span>
            高騰ランキング
          </h2>
          <RankingTable cards={rising} direction="up" />
        </div>

        {/* 下落ランキング */}
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400 text-xs">↓</span>
            下落ランキング
          </h2>
          <RankingTable cards={falling} direction="down" />
        </div>
      </div>
    </div>
  );
}
