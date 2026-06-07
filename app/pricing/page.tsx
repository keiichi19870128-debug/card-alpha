import type { Metadata } from "next";
import { UpgradeButton } from "@/app/components/UserActions";

export const metadata: Metadata = {
  title: "料金プラン",
  description: "Card Alphaのプレミアム会員プラン。月額380円で限定記事・戦略・価格アラート等の全機能が使い放題。",
};

export default function PricingPage() {
  const freeFeatures = [
    "注目カードの閲覧",
    "記事の一部閲覧",
    "ランキングの閲覧",
    "ウォッチリスト（5件まで）",
    "価格アラート（3件まで）",
  ];

  const premiumFeatures = [
    "広告非表示",
    "全ての限定記事を閲覧",
    "限定投資戦略の閲覧",
    "AI分析スコア詳細版",
    "ウォッチリスト（無制限）",
    "価格アラート（無制限）",
    "価格推移データのエクスポート",
    "優先サポート",
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">料金プラン</h1>
        <p className="mt-4 text-lg text-muted">
          カード投資をもっと有利に。プレミアム会員で全機能を使いこなそう。
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {/* Free Plan */}
        <div className="rounded-2xl border border-border bg-surface p-8">
          <h2 className="text-xl font-bold">Free</h2>
          <div className="mt-4">
            <span className="text-4xl font-extrabold">¥0</span>
            <span className="text-muted ml-1">/月</span>
          </div>
          <p className="mt-4 text-sm text-muted">基本機能で始めてみたい方に</p>
          <ul className="mt-8 space-y-3">
            {freeFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <span className="text-green-400 shrink-0">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Premium Plan */}
        <div className="rounded-2xl border-2 border-accent bg-surface p-8 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold text-white">
            おすすめ
          </div>
          <h2 className="text-xl font-bold">Premium</h2>
          <div className="mt-4">
            <span className="text-4xl font-extrabold text-accent">¥380</span>
            <span className="text-muted ml-1">/月</span>
          </div>
          <p className="mt-4 text-sm text-muted">本格的にカード投資を始める方に</p>
          <ul className="mt-8 space-y-3">
            {premiumFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <span className="text-accent shrink-0">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <UpgradeButton />
          </div>
        </div>
      </div>
    </div>
  );
}
