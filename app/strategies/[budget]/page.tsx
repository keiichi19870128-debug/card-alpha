import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStrategyByBudget, formatPrice } from "@/lib/db";

type Props = {
  params: Promise<{ budget: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const budget = parseInt(p.budget, 10).toLocaleString();
  const title = `${budget}円コース | 予算別投資戦略`;
  const description = `${budget}円の予算で組むポケモンカード投資戦略。おすすめカード構成と投資のポイントを解説します。`;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function StrategyDetailPage({ params }: Props) {
  const p = await params;
  const budget = parseInt(p.budget, 10);
  const strategy = await getStrategyByBudget(budget);

  if (!strategy) notFound();

  const tips = [
    "未開封品は長期保存が前提",
    "人気キャラクターを中心に選ぶ",
    "状態（PSA10）にこだわる",
    "海外市場の動向も確認する",
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/strategies" className="text-sm text-muted hover:text-foreground transition-colors">
        ← 予算別戦略一覧
      </Link>

      <div className="mt-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {strategy.budget_amount.toLocaleString()}円コース
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">{strategy.description}</p>

        {strategy.content && (
          <div className="mt-6 rounded-xl border border-border bg-surface p-6">
            <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-line">
              {strategy.content}
            </div>
          </div>
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold">おすすめカード構成（サンプル）</h2>
        <p className="mt-2 text-muted text-sm">
          この予算で実際に検討できるカードの組み合わせ例です。（管理画面で編集可能）
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            { name: "リザードンV（SA）", price: 120000, qty: 1, rating: "S", reason: "30周年で再評価される可能性大" },
            { name: "ピカチュウVMAX（HR）", price: 45000, qty: 1, rating: "A", reason: "人気キャラで需要が安定" },
            { name: "古代の咆哮 BOX", price: 5500, qty: 10, rating: "A", reason: "未開封価値の安定性が高い" },
            { name: "ピカチュウ AR", price: 12000, qty: 3, rating: "A", reason: "人気キャラで需要が安定" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-xl border border-border bg-surface p-4"
            >
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-2xl">
                🃏
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                </div>
                <p className="mt-1 text-lg font-bold text-primary">
                  {formatPrice(item.price)}
                  <span className="ml-2 text-xs text-muted font-normal">× {item.qty}枚</span>
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`text-xs font-bold rounded px-1.5 py-0.5 ${
                    item.rating === "S" ? "bg-yellow-500/20 text-yellow-400" :
                    item.rating === "A" ? "bg-green-500/20 text-green-400" :
                    "bg-blue-500/20 text-blue-400"
                  }`}>
                    {item.rating}ランク
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted line-clamp-1">{item.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold">ポイント</h2>
        <ul className="mt-4 space-y-3">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                {i + 1}
              </span>
              <span className="text-sm">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
