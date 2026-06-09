import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCardById, formatPrice, getDb } from "@/lib/db";
import { CardImage } from "@/app/components/CardImage";
import { PriceChart } from "@/app/components/PriceChart";
import { AnalysisScoreCard } from "@/app/components/AnalysisScore";
import { calculateAnalysisScore } from "@/lib/analysis";
import { WatchlistButton, AlertButton } from "@/app/components/UserActions";
import { getServerSession } from "next-auth";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const card = await getCardById(p.id);
  if (!card) return { title: "Not Found | Card Alpha" };
  const title = `${card.name} | 注目カード`;
  const description = `${card.name}の現在価格${formatPrice(card.current_price)}・${card.rating}ランク評価・注目理由を解説。ポケモンカード投資の参考に。`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(card.image_url ? { images: [{ url: card.image_url, alt: card.name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CardDetailPage({ params }: Props) {
  const p = await params;
  const card = await getCardById(p.id);
  if (!card) notFound();

  // Fetch price history
  const { rows: priceHistory } = await getDb().query(
    "SELECT price, recorded_at FROM price_histories WHERE card_id = $1 ORDER BY recorded_at ASC",
    [p.id]
  );
  const chartData = priceHistory.map((row: any) => ({
    date: new Date(row.recorded_at).toLocaleDateString("ja-JP", { month: "short", day: "numeric" }),
    price: row.price,
  }));

  // Check if user is watching this card
  const session = await getServerSession();
  let isWatched = false;
  if (session?.user?.email) {
    const { rows: userRow } = await getDb().query("SELECT id FROM users WHERE email = $1", [session.user.email]);
    if (userRow[0]) {
      const { rows: wl } = await getDb().query(
        "SELECT id FROM watchlists WHERE user_id = $1 AND card_id = $2",
        [userRow[0].id, p.id]
      );
      isWatched = wl.length > 0;
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/cards" className="text-sm text-muted hover:text-foreground transition-colors">
        ← 注目カード一覧
      </Link>

      <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-start">
        <div className="aspect-[3/4] rounded-2xl bg-surface border border-border flex items-center justify-center overflow-hidden">
          <CardImage src={card.image_url} alt={card.name} size="lg" className="w-full h-full" />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">{card.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${
              card.rating === "S" ? "bg-yellow-500/20 text-yellow-400" :
              card.rating === "A" ? "bg-green-500/20 text-green-400" :
              "bg-blue-500/20 text-blue-400"
            }`}>
              {card.rating}ランク
            </span>
            {card.rarity && (
              <span className="text-sm text-muted">{card.rarity}</span>
            )}
          </div>

          <div className="mt-6">
            <p className="text-sm text-muted">現在価格</p>
            <p className="text-3xl font-extrabold text-primary">{formatPrice(card.current_price)}</p>
          </div>

          {session?.user && (
            <div className="mt-4 flex flex-wrap gap-2">
              <WatchlistButton cardId={p.id} isWatched={isWatched} />
              <AlertButton cardId={p.id} />
            </div>
          )}

          {card.card_code && (
            <div className="mt-4 text-sm text-muted">
              カードコード: {card.card_code}
            </div>
          )}
          {card.set_name && (
            <div className="mt-1 text-sm text-muted">
              拡張パック: {card.set_name}
            </div>
          )}

          {card.reason && (
            <div className="mt-8">
              <h2 className="text-lg font-bold">注目理由</h2>
              <div className="mt-3 rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed whitespace-pre-line">
                {card.reason}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 価格推移グラフ & AI分析 */}
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold mb-4">価格推移</h2>
          <div className="rounded-xl border border-border bg-surface p-6">
            <PriceChart data={chartData} />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">AI分析</h2>
          <AnalysisScoreCard score={calculateAnalysisScore({
            rating: card.rating,
            current_price: card.current_price,
            rarity: card.rarity,
            set_name: card.set_name,
            is_featured: card.is_featured,
          })} />
        </div>
      </div>
    </div>
  );
}
