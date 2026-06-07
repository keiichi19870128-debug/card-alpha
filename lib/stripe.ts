import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});

export const PLANS = {
  premium: {
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID || "",
    name: "プレミアム会員",
    price: 380,
    interval: "month" as const,
    features: [
      "広告非表示",
      "限定記事の閲覧",
      "限定投資戦略の閲覧",
      "価格アラート機能（無制限）",
      "AI分析スコア詳細版",
      "優先サポート",
    ],
  },
};
