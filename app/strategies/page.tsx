import type { Metadata } from "next";
import Link from "next/link";
import { getAllStrategies } from "@/lib/db";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "予算別投資戦略",
  description: "1万円〜15万円の予算に合わせたポケモンカード投資戦略をご提案。初心者でも安心して始められます。",
  openGraph: {
    title: "予算別投資戦略 | Card Alpha",
    description: "1万円〜15万円の予算に合わせたポケモンカード投資戦略をご提案。初心者でも安心して始められます。",
  },
};

export default async function StrategiesPage() {
  const strategies = await getAllStrategies();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">予算別投資戦略</h1>
      <p className="mt-4 text-lg text-muted">
        あなたの予算に合わせた最適なカード戦略をご用意しました。
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {strategies.map((s) => (
          <Link
            key={s.id}
            href={`/strategies/${s.budget_amount}`}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-8 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-primary">
                {s.budget_amount.toLocaleString()}円
              </span>
              <span className="text-lg font-semibold text-muted">{s.title}</span>
            </div>
            <p className="mt-4 text-muted leading-relaxed">{s.description}</p>
            <div className="mt-6 inline-flex items-center text-sm font-semibold text-primary group-hover:underline">
              詳細を見る →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
