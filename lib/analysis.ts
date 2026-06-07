/**
 * AI分析スコア算出ロジック
 * 人気度・希少性・将来性の3軸でスコアリング
 */

type CardData = {
  rating: string;
  current_price: number;
  rarity: string | null;
  set_name: string | null;
  is_featured: boolean;
};

export type AnalysisScore = {
  popularity: number;   // 人気度 (0-100)
  rarity: number;       // 希少性 (0-100)
  potential: number;    // 将来性 (0-100)
  overall: number;      // 総合 (0-100)
};

const rarityScores: Record<string, number> = {
  SSR: 95,
  UR: 90,
  SR: 75,
  HR: 70,
  RR: 55,
  AR: 50,
  R: 35,
  BOX: 40,
};

export function calculateAnalysisScore(card: CardData): AnalysisScore {
  // 人気度: rating + featured status + price range
  let popularity = 0;
  if (card.rating === "S") popularity = 90;
  else if (card.rating === "A") popularity = 70;
  else popularity = 50;
  if (card.is_featured) popularity += 5;
  // Price-based adjustment (higher price = more popular)
  if (card.current_price >= 200000) popularity = Math.min(100, popularity + 8);
  else if (card.current_price >= 100000) popularity = Math.min(100, popularity + 5);
  else if (card.current_price >= 50000) popularity = Math.min(100, popularity + 3);

  // 希少性: rarity + price
  let rarityScore = rarityScores[card.rarity || ""] || 40;
  if (card.current_price >= 300000) rarityScore = Math.min(100, rarityScore + 15);
  else if (card.current_price >= 150000) rarityScore = Math.min(100, rarityScore + 10);
  else if (card.current_price >= 80000) rarityScore = Math.min(100, rarityScore + 5);

  // 将来性: rating-based + old set bonus
  let potential = 0;
  if (card.rating === "S") potential = 85;
  else if (card.rating === "A") potential = 65;
  else potential = 45;
  // Older sets tend to appreciate more
  const oldSets = ["VMAXクライマックス", "シャイニースターV", "イーブイヒーローズ", "コレクションサン", "ライデンナックル"];
  if (card.set_name && oldSets.some(s => card.set_name!.includes(s))) {
    potential = Math.min(100, potential + 10);
  }
  if (card.current_price >= 100000) potential = Math.min(100, potential + 5);

  const overall = Math.round((popularity + rarityScore + potential) / 3);

  return {
    popularity,
    rarity: rarityScore,
    potential,
    overall,
  };
}
