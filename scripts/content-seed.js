const Database = require("better-sqlite3");

const db = new Database("prisma/dev.db");

try {
  const game = db.prepare("SELECT id FROM games WHERE slug = 'pokemon-card'").get();
  if (!game) { console.log("No game found. Run seed-sqlite.js first."); process.exit(1); }

  const categories = db.prepare("SELECT * FROM article_categories").all();
  const catIds = categories.reduce((a, c) => { a[c.slug] = c.id; return a; }, {});

  const cards = [
    { name: "リザードンVSTAR（UR）", currentPrice: 250000, rating: "S", cardCode: "s12a-099", rarity: "UR", setName: "VSTARユニバース", reason: "リザードンの最上位レアリティ。未再録の可能性が極めて高く、海外市場でも最高額を記録。" },
    { name: "ピカチュウV（SA）", currentPrice: 68000, rating: "A", cardCode: "s4a-221", rarity: "SR", setName: "シャイニースターV", reason: "ブルースカイの背景が美しい。ピカチュウ人気の高まりで安定した値上がり。" },
    { name: "ミュウツーV（SA）", currentPrice: 150000, rating: "S", cardCode: "s12a-026", rarity: "SR", setName: "VSTARユニバース", reason: "初代最強ポケモン。30周年に向けて懐かしさと強さで再評価必至。" },
    { name: "ブラッキーVMAX（SA）", currentPrice: 42000, rating: "A", cardCode: "s6a-076", rarity: "SR", setName: "イーブイヒーローズ", reason: "クールなデザインが人気。女性ファンからも絶大な支持を受けている。" },
    { name: "ニンフィアVMAX（SA）", currentPrice: 38000, rating: "B", cardCode: "s6a-093", rarity: "SR", setName: "イーブイヒーローズ", reason: "女性ファンの圧倒的人気。かわいらしさと儚さが魅力の一枚。" },
    { name: "シャイニーミュウ", currentPrice: 220000, rating: "S", cardCode: "s4a-279", rarity: "SSR", setName: "シャイニースターV", reason: "限定カード。ホロ仕様が美しく、コレクションの中でもトップクラスの資産価値。" },
    { name: "リザードンex（SR）", currentPrice: 85000, rating: "A", cardCode: "sv1s-125", rarity: "SR", setName: "スカーレットex", reason: "新時代のリザードン。デザイン刷新で若い層にも人気。長期的に値上がりの可能性大。" },
    { name: "ルギアVSTAR（SA）", currentPrice: 55000, rating: "A", cardCode: "s12a-139", rarity: "SR", setName: "VSTARユニバース", reason: "伝説の銀色の翼。VSTARパワーと美麗なイラストで人気急上昇。" },
    { name: "コイキング（AR）", currentPrice: 8000, rating: "B", cardCode: "s11a-071", rarity: "AR", setName: "白熱のアルカナ", reason: "コミカルで愛らしいデザイン。低価格帯でコレクションしやすい穴場カード。" },
    { name: "グレイシアVMAX（SA）", currentPrice: 45000, rating: "A", cardCode: "s6a-041", rarity: "SR", setName: "イーブイヒーローズ", reason: "冷色調の美麗なイラスト。季節感と相まって価値が高まる可能性。" },
    { name: "リーリエ（SR）", currentPrice: 350000, rating: "S", cardCode: "sm1m-066", rarity: "SR", setName: "コレクションサン", reason: "女性サポートカードの最高峰。プレミアムな一枚、状態によっては50万円超えも。" },
    { name: "ミステリーボックス", currentPrice: 12000, rating: "B", cardCode: "s3a-062", rarity: "UR", setName: "伝説の鼓動", reason: "未開封BOXの希少性。未開封品は年々減少し資産価値が上昇。" },
    { name: "リザードンV（PSA10）", currentPrice: 180000, rating: "S", cardCode: "s1a-202", rarity: "SR", setName: "VMAXライジング", reason: "PSA10保証付きで安心。リザードンの人気は不動、値下がりリスクが極めて低い。" },
    { name: "カイリューV（SA）", currentPrice: 32000, rating: "A", cardCode: "s11-174", rarity: "SR", setName: "ロストアビス", reason: "初代最強進化系。ドラゴンタイプの中でも美麗なイラストで人気。" },
    { name: "ピカチュウVMAX（PSA10）", currentPrice: 55000, rating: "A", cardCode: "s4a-283", rarity: "SSR", setName: "シャイニースターV", reason: "PSA10鑑定済み。ピカチュウは需要が最も安定している安全資産。" },
  ];

  for (const c of cards) {
    try {
      db.prepare(
        "INSERT INTO cards (id, name, current_price, rating, game_id, card_code, rarity, set_name, reason, is_featured, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).run(
        crypto.randomUUID(), c.name, c.currentPrice, c.rating, game.id,
        c.cardCode, c.rarity, c.setName, c.reason, 1, "active",
        new Date().toISOString(), new Date().toISOString()
      );
    } catch (e) { console.log("Skip", c.name); }
  }

  const articles = [
    {
      title: "【2026年10月】今週の高騰ランキングTOP5",
      slug: "weekly-top5-october-2026",
      categoryId: catIds["price-prediction"],
      content: `# 今週の高騰ランキング\n\n今週はポケモン30周年関連のニュースが複数出たことで、関連カードが全面的に高騰しています。\n\n## 1位：リザードンVSTAR（UR） +15.2%\n\n30周年プロモーション発表による波及効果。新規参入者が最も買いたいカードとして人気急上昇。\n\n## 2位：ミュウツーV（SA） +12.8%\n\n初代リメイク映画の噂が再燃。ミュウツー人気は30周年に向けてさらに加速する見込み。\n\n## 3位：リーリエ（SR） +8.5%\n\n安定した高値を維持。新人気サポートカードが出現しても、リーリエの価値は揺るがない。`,
    },
    {
      title: "PSA鑑定完全ガイド〜自宅で状態を確認する方法",
      slug: "psa-guide-home-check",
      categoryId: catIds["investment-strategy"],
      content: `# PSA鑑定完全ガイド\n\n## 自宅でできる状態チェック\n\nPSA10を狙うなら、購入前に以下の4箇所を必ず確認しましょう。\n\n## 1. 四隅（コーナー）\n\n10倍ルーペで四隅を確認。白い擦れや折れがないかが鍵。\n\n## 2. エッジ（縁）\n\n光にかざして縁に白線が出ていないか確認。\n\n## 3. サーフェイス（表面）\n\n指紋や微細な傷は光の角度を変えて確認。\n\n## 4. センタリング（配置）\n\n枠線が左右・上下バランスよく配置されているか。`,
    },
    {
      title: "【初心者向け】5万円で作る最強ポートフォリオ",
      slug: "beginner-5man-portfolio",
      categoryId: catIds["investment-strategy"],
      content: `# 5万円で作る最強ポートフォリオ\n\n## ポートフォリオ構成\n\n### 3万円：メインカード「ピカチュウVMAX（HR）」\n\n安定の人気カード。リスクが最も低い。\n\n### 1.5万円：「ピカチュウV（SA）」\n\n美麗なイラストカード。女性ファンも魅了。\n\n### 0.5万円：「コイキング（AR）」\n\n穴場候補。安価ながらコレクション価値あり。`,
    },
    {
      title: "ワンピースカード対応について〜Card Alphaのロードマップ",
      slug: "onepiece-roadmap",
      categoryId: catIds["pokemon-card"],
      content: `# ワンピースカードへの対応について\n\n## 現時点の準備状況\n\nCard Alphaのデータベース設計には、ゲーム種別の切り替え機能が組み込まれています。\n\n今後、ワンピースカードへ対応する準備は整っています。\n\n## 対応予定の機能\n\n- 人気キャラ別分析（ルフィ・ゾロ・ロビンなど）\n- パラレルカードの希少性スコア\n- 年版別のBOX投資戦略`,
    },
  ];

  for (const a of articles) {
    try {
      db.prepare(
        "INSERT INTO articles (id, title, slug, content, category_id, is_published, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).run(
        crypto.randomUUID(), a.title, a.slug, a.content, a.categoryId,
        1, new Date().toISOString(), new Date().toISOString(), new Date().toISOString()
      );
    } catch (e) { console.log("Skip article", a.slug); }
  }

  console.log("Content seed completed!");
} finally {
  db.close();
}
