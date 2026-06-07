import Link from "next/link";
import {
  getFeaturedCards,
  getPublishedArticles,
  getAllStrategies,
  formatPrice,
} from "@/lib/db";
import { CardImage } from "@/app/components/CardImage";

export const revalidate = 3600; // ISR: 1時間ごとに再生成

function RatingBadge({ rating }: { rating: string }) {
  const colors: Record<string, string> = {
    S: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    A: "bg-green-500/20 text-green-400 border-green-500/30",
    B: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${colors[rating] || colors.B}`}
    >
      {rating}ランク
    </span>
  );
}

export default async function HomePage() {
  const featuredCards = await getFeaturedCards(4);
  const latestArticles = await getPublishedArticles(3);
  const strategies = await getAllStrategies();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            カード市場で、<br className="sm:hidden" />
            <span className="text-primary">一歩先</span>を読む。
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            Card Alphaは、ポケモンカード投資の判断を支援する分析プラットフォーム。
            予算別戦略から注目カードまで、初心者でも安心して始められます。
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/strategies"
              className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              予算別戦略を見る →
            </Link>
            <Link
              href="/cards"
              className="inline-flex items-center rounded-lg border border-border px-6 py-3 text-sm font-semibold hover:bg-surface-hover transition-colors"
            >
              注目カードを見る
            </Link>
          </div>
        </div>
      </section>

      {/* 注目カード */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">注目カード</h2>
          <Link href="/cards" className="text-sm text-primary hover:underline">
            すべて見る →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {featuredCards.map((card: any) => (
            <Link
              key={card.id}
              href={`/cards/${card.id}`}
              className="group rounded-xl border border-border bg-surface p-4 hover:border-primary/30 transition-colors"
            >
              <div className="aspect-[3/4] rounded-lg bg-surface-hover flex items-center justify-center mb-3 overflow-hidden">
                <CardImage src={card.image_url} alt={card.name} size="sm" className="w-full h-full" />
              </div>
              <h3 className="font-semibold text-sm line-clamp-1">{card.name}</h3>
              <p className="mt-1 text-lg font-bold text-primary">
                {formatPrice(card.current_price)}
              </p>
              <div className="mt-2">
                <RatingBadge rating={card.rating} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 予算別戦略 */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">予算別投資戦略</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {strategies.map((s: any) => (
              <Link
                key={s.id}
                href={`/strategies/${s.budget_amount}`}
                className="group relative overflow-hidden rounded-xl border border-border bg-background p-6 hover:border-primary/30 transition-colors"
              >
                <div className="text-3xl font-extrabold text-primary">
                  {s.budget_amount.toLocaleString()}円
                </div>
                <div className="mt-2 text-lg font-semibold">{s.title}</div>
                <p className="mt-2 text-sm text-muted line-clamp-2">
                  {s.description}
                </p>
                <div className="mt-4 text-sm text-primary group-hover:underline">
                  詳細を見る →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 最新記事 */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">最新記事</h2>
          <Link href="/articles" className="text-sm text-primary hover:underline">
            すべて見る →
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {latestArticles.map((article: any) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="flex gap-4 rounded-xl border border-border bg-surface p-4 hover:border-primary/30 transition-colors"
            >
              <div className="hidden sm:flex h-20 w-32 shrink-0 items-center justify-center rounded-lg bg-surface-hover">
                <span className="text-2xl">📝</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{article.title}</h3>
                <p className="mt-1 text-sm text-muted line-clamp-2">
                  {article.content.replace(/[#*`\n]/g, " ").slice(0, 100)}...
                </p>
                <div className="mt-2 text-xs text-muted">
                  {article.published_at
                    ? new Date(article.published_at).toLocaleDateString("ja-JP")
                    : ""}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
