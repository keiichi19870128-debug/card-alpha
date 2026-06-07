import type { Metadata } from "next";
import Link from "next/link";
import { getAllCards, formatPrice } from "@/lib/db";
import { CardImage } from "@/app/components/CardImage";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "注目カード",
  description: "Card Alphaが厳選した注目のポケモンカード一覧。S・A・Bランク別に評価し、投資判断をサポートします。",
  openGraph: {
    title: "注目カード | Card Alpha",
    description: "Card Alphaが厳選した注目のポケモンカード一覧。S・A・Bランク別に評価し、投資判断をサポートします。",
  },
};

export default async function CardsPage() {
  const cards = await getAllCards();
  const ratings = ["すべて", "S", "A", "B"];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">注目カード</h1>
      <p className="mt-4 text-lg text-muted">
        Card Alphaが厳選した、今後の値上がりが期待できるポケモンカードです。
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {ratings.map((r) => (
          <button
            key={r}
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-primary/30 transition-colors"
          >
            {r === "すべて" ? r : `${r}ランク`}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={`/cards/${card.id}`}
            className="group rounded-xl border border-border bg-surface p-4 hover:border-primary/30 transition-colors"
          >
            <div className="aspect-[3/4] rounded-lg bg-surface-hover flex items-center justify-center mb-3 overflow-hidden">
              <CardImage src={card.image_url} alt={card.name} size="sm" className="w-full h-full" />
            </div>
            <h2 className="font-semibold text-sm line-clamp-1">{card.name}</h2>
            <p className="mt-1 text-lg font-bold text-primary">{formatPrice(card.current_price)}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${
                card.rating === "S" ? "bg-yellow-500/20 text-yellow-400" :
                card.rating === "A" ? "bg-green-500/20 text-green-400" :
                "bg-blue-500/20 text-blue-400"
              }`}>
                {card.rating}ランク
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
