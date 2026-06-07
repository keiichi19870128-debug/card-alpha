const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const existingGame = await prisma.game.findFirst({ where: { slug: "pokemon-card" } });
  if (existingGame) {
    console.log("Seed already exists");
    return;
  }

  const game = await prisma.game.create({
    data: { name: "ポケモンカード", slug: "pokemon-card" },
  });

  const category1 = await prisma.articleCategory.create({ data: { name: "ポケモンカード", slug: "pokemon-card", sortOrder: 1 } });
  const category2 = await prisma.articleCategory.create({ data: { name: "投資戦略", slug: "investment-strategy", sortOrder: 2 } });
  const category3 = await prisma.articleCategory.create({ data: { name: "高騰予想", slug: "price-prediction", sortOrder: 3 } });

  await prisma.card.createMany({
    data: [
      { name: "リザードンV（SA）", currentPrice: 120000, rating: "S", gameId: game.id, isFeatured: true, cardCode: "s8b-173", rarity: "SR", setName: "VMAXクライマックス", reason: "リザードンはポケモンカードの顔。30周年に向けて再評価される可能性大。PSA10の鑑定枚数も限定的で希少性が高い。" },
      { name: "ピカチュウVMAX（HR）", currentPrice: 45000, rating: "A", gameId: game.id, isFeatured: true, cardCode: "s4-114", rarity: "HR", setName: "仰天のボルテッカー", reason: "人気キャラで需要が安定。海外市場でも需要が高く、長期的に値下がりリスクが低い。" },
      { name: "ミュウV（SA）", currentPrice: 89000, rating: "S", gameId: game.id, isFeatured: true, cardCode: "s8b-169", rarity: "SR", setName: "VMAXクライマックス", reason: "かわいらしいイラストと強さで男女問わず人気。未再録の可能性が高い。" },
      { name: "ルギアV（SA）", currentPrice: 15000, rating: "B", gameId: game.id, isFeatured: true, cardCode: "s11-186", rarity: "SR", setName: "ロストアビス", reason: "人気伝説ポケモンだが、供給が比較的多い。長期保有向き。" },
      { name: "メイ（SR）", currentPrice: 180000, rating: "S", gameId: game.id, cardCode: "bw8-080", rarity: "SR", setName: "ライデンナックル", reason: "サポートカードの中でもトップクラスの人気。女性サポートは希少で値下がりしにくい。" },
      { name: "エーフィV（SA）", currentPrice: 35000, rating: "A", gameId: game.id, cardCode: "s6a-041", rarity: "SR", setName: "イーブイヒーローズ", reason: "イーブイフレンズ人気の牽引役。ブイズ全般が強い中でも上位人気。" },
    ],
  });

  const strategy1 = await prisma.budgetStrategy.create({ data: { budgetAmount: 10000, title: "1万円コース", description: "少額から始める投資の第一歩。確実に価値を保つカードを厳選しました。", gameId: game.id, sortOrder: 1 } });
  const strategy2 = await prisma.budgetStrategy.create({ data: { budgetAmount: 50000, title: "5万円コース", description: "バランスの良いポートフォリオを組めます。確実性と成長性を両立させた構成です。", gameId: game.id, sortOrder: 2 } });
  const strategy3 = await prisma.budgetStrategy.create({ data: { budgetAmount: 100000, title: "10万円コース", description: "プレミアムカードと未開封BOXのバランス型。30周年に向けて大きな値上がりを狙えます。", gameId: game.id, sortOrder: 3 } });
  const strategy4 = await prisma.budgetStrategy.create({ data: { budgetAmount: 150000, title: "15万円コース", description: "本格的な投資を始めるならこのコース。高額カードと未開封BOXで確実な資産形成。", gameId: game.id, sortOrder: 4 } });

  await prisma.article.createMany({
    data: [
      {
        title: "ポケモン30周年に向けて仕込むべきカード5選",
        slug: "pokemon-30th-anniversary-top5",
        content: "## 2026年ポケモン30周年への期待\n\n2026年にポケモン30周年を迎えるにあたり、市場はすでに動き始めています。今回は、今から仕込んでおくべき注目カードを5枚厳選しました。\n\n### 1. リザードンV（SA）\n\n現在価格: ¥120,000\n評価: Sランク\n\nリザードンはポケモンカードの顔であり、常に高い人気と需要を誇ります。30周年に向けての特別プロモーションが予想されており、価格上昇の可能性が大きいです。\n\n- PSA10の鑑定枚数が限られている\n- 海外市場でも需要が高い\n- 歴史的にリザードン系は高騰を繰り返している\n\n### 2. ピカチュウVMAX（HR）\n\n現在価格: ¥45,000\n評価: Aランク\n\nポケモンの中で最も知名度の高いキャラクター。安定した需要があるため、初心者にもおすすめ。",
        categoryId: category3.id,
        featuredImage: "/images/article-1.jpg",
        isPublished: true,
        publishedAt: new Date("2026-06-01T10:00:00Z"),
      },
      {
        title: "初心者が最初に買うべきカードガイド",
        slug: "beginners-first-card-guide",
        content: "## はじめに\n\nポケモンカード投資を始めたいけど、何を買えばいいか分からない。そんな悩みを持つ人は多いです。\n\nこの記事では、初心者が最初に買うべきカードと、その選び方のポイントを解説します。\n\n### ポイント1: 人気キャラクターを中心に選ぶ\n\nリザードン、ピカチュウ、ミュウなど、知名度の高いキャラクターのカードは需要が安定しています。\n\n### ポイント2: 状態（PSA10）にこだわる\n\n同じカードでも、状態の違いで価格が数倍変わります。コレクションとしての価値を最大化するには、PSA10を狙いましょう。",
        categoryId: category2.id,
        featuredImage: "/images/article-2.jpg",
        isPublished: true,
        publishedAt: new Date("2026-05-28T10:00:00Z"),
      },
      {
        title: "PSA10の買い方・保存の裏ワザ",
        slug: "psa10-tips",
        content: "## PSA10とは\n\nPSA（Professional Sports Authenticator）による最高グレードです。カードの状態が完璧であることを証明しています。\n\n### 保存のポイント\n\n1. 直射日光を避ける\n2. 湿度管理（40-60%が理想）\n3. スリーブ + ローダー + ケースの3重構造\n\n### 購入時の注意点\n\n- 偽物に注意\n- 出品者の評価を確認\n- 返品ポリシーを確認",
        categoryId: category1.id,
        featuredImage: "/images/article-3.jpg",
        isPublished: true,
        publishedAt: new Date("2026-05-25T10:00:00Z"),
      },
    ],
  });

  console.log("Seed completed:", {
    gameId: game.id,
    strategies: [strategy1.id, strategy2.id, strategy3.id, strategy4.id].join(", "),
  });
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
