import sqlite3 from 'better-sqlite3';

const db = sqlite3('prisma/dev.db');

const game = {
  id: crypto.randomUUID(),
  name: "ポケモンカード",
  slug: "pokemon-card",
  logoUrl: null,
  isActive: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

try {
  db.prepare('INSERT INTO games (id, name, slug, logo_url, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(game.id, game.name, game.slug, game.logoUrl, game.isActive, game.created_at, game.updated_at);
} catch (e) {
  console.log("Game already exists");
  process.exit(0);
}

const categories = [
  { id: crypto.randomUUID(), name: "ポケモンカード", slug: "pokemon-card", sortOrder: 1 },
  { id: crypto.randomUUID(), name: "投資戦略", slug: "investment-strategy", sortOrder: 2 },
  { id: crypto.randomUUID(), name: "高騰予想", slug: "price-prediction", sortOrder: 3 },
];

for (const c of categories) {
  db.prepare('INSERT INTO article_categories (id, name, slug, sort_order, created_at) VALUES (?, ?, ?, ?, ?)')
    .run(c.id, c.name, c.slug, c.sortOrder, new Date().toISOString());
}

const cards = [
  { name: "リザードンV（SA）", price: 120000, rating: "S", code: "s8b-173", rarity: "SR", set: "VMAXクライマックス", reason: "リザードンはポケモンカードの顔。30周年に向けて再評価される可能性大。PSA10の鑑定枚数も限定的で希少性が高い。" },
  { name: "ピカチュウVMAX（HR）", price: 45000, rating: "A", code: "s4-114", rarity: "HR", set: "仰天のボルテッカー", reason: "人気キャラで需要が安定。海外市場でも需要が高く、長期的に値下がりリスクが低い。" },
  { name: "ミュウV（SA）", price: 89000, rating: "S", code: "s8b-169", rarity: "SR", set: "VMAXクライマックス", reason: "かわいらしいイラストと強さで男女問わず人気。未再録の可能性が高い。" },
  { name: "ルギアV（SA）", price: 15000, rating: "B", code: "s11-186", rarity: "SR", set: "ロストアビス", reason: "人気伝説ポケモンだが、供給が比較的多い。長期保有向き。" },
  { name: "メイ（SR）", price: 180000, rating: "S", code: "bw8-080", rarity: "SR", set: "ライデンナックル", reason: "サポートカードの中でもトップクラスの人気。女性サポートは希少で値下がりしにくい。" },
  { name: "エーフィV（SA）", price: 35000, rating: "A", code: "s6a-041", rarity: "SR", set: "イーブイヒーローズ", reason: "イーブイフレンズ人気の牽引役。ブイズ全般が強い中でも上位人気。" },
];

for (const c of cards) {
  db.prepare('INSERT INTO cards (id, name, current_price, rating, game_id, card_code, rarity, set_name, reason, is_featured, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(crypto.randomUUID(), c.name, c.price, c.rating, game.id, c.code, c.rarity, c.set, c.reason, 1, "active", new Date().toISOString(), new Date().toISOString());
}

const strategies = [
  { amount: 10000, title: "1万円コース", desc: "少額から始める投資の第一歩。確実に価値を保つカードを厳選しました。", sort: 1 },
  { amount: 50000, title: "5万円コース", desc: "バランスの良いポートフォリオを組めます。確実性と成長性を両立させた構成です。", sort: 2 },
  { amount: 100000, title: "10万円コース", desc: "プレミアムカードと未開封BOXのバランス型。30周年に向けて大きな値上がりを狙えます。", sort: 3 },
  { amount: 150000, title: "15万円コース", desc: "本格的な投資を始めるならこのコース。高額カードと未開封BOXで確実な資産形成。", sort: 4 },
];

for (const s of strategies) {
  db.prepare('INSERT INTO budget_strategies (id, budget_amount, title, description, game_id, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(crypto.randomUUID(), s.amount, s.title, s.desc, game.id, s.sort, new Date().toISOString(), new Date().toISOString());
}

const articles = [
  { title: "ポケモン30周年に向けて仕込むべきカード5選", slug: "pokemon-30th-anniversary-top5", content: "## 2026年ポケモン30周年への期待\n\n2026年にポケモン30周年を迎えるにあたり、市場はすでに動き始めています。今回は、今から仕込んでおくべき注目カードを5枚厳選しました。\n\n### 1. リザードンV（SA）\n\n現在価格: ¥120,000\n評価: Sランク\n\nリザードンはポケモンカードの顔であり、常に高い人気と需要を誇ります。30周年に向けての特別プロモーションが予想されており、価格上昇の可能性が大きいです。\n\n- PSA10の鑑定枚数が限られている\n- 海外市場でも需要が高い\n- 歴史的にリザードン系は高騰を繰り返している\n\n### 2. ピカチュウVMAX（HR）\n\n現在価格: ¥45,000\n評価: Aランク\n\nポケモンの中で最も知名度の高いキャラクター。安定した需要があるため、初心者にもおすすめ。", catId: categories[2].id },
  { title: "初心者が最初に買うべきカードガイド", slug: "beginners-first-card-guide", content: "## はじめに\n\nポケモンカード投資を始めたいけど、何を買えばいいか分からない。そんな悩みを持つ人は多いです。\n\nこの記事では、初心者が最初に買うべきカードと、その選び方のポイントを解説します。\n\n### ポイント1: 人気キャラクターを中心に選ぶ\n\nリザードン、ピカチュウ、ミュウなど、知名度の高いキャラクターのカードは需要が安定しています。\n\n### ポイント2: 状態（PSA10）にこだわる\n\n同じカードでも、状態の違いで価格が数倍変わります。コレクションとしての価値を最大化するには、PSA10を狙いましょう。", catId: categories[1].id },
  { title: "PSA10の買い方・保存の裏ワザ", slug: "psa10-tips", content: "## PSA10とは\n\nPSA（Professional Sports Authenticator）による最高グレードです。カードの状態が完璧であることを証明しています。\n\n### 保存のポイント\n\n1. 直射日光を避ける\n2. 湿度管理（40-60%が理想）\n3. スリーブ + ローダー + ケースの3重構造\n\n### 購入時の注意点\n\n- 偽物に注意\n- 出品者の評価を確認\n- 返品ポリシーを確認", catId: categories[0].id },
];

for (const a of articles) {
  db.prepare('INSERT INTO articles (id, title, slug, content, category_id, is_published, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(crypto.randomUUID(), a.title, a.slug, a.content, a.catId, 1, new Date().toISOString(), new Date().toISOString(), new Date().toISOString());
}

console.log("Seed completed");
db.close();
