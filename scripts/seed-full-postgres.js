/**
 * Card Alpha - Full PostgreSQL Seed Script
 * カード20-30枚、記事10-15本、戦略4パターン、カテゴリ3種を投入
 *
 * Usage: node scripts/seed-full-postgres.js
 * Requires: DATABASE_URL env var
 */
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:kei018719kei@db.thiqkihrccoiqcfmvdhj.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Clear in order (foreign keys)
    await client.query("DELETE FROM strategy_card_items");
    await client.query("DELETE FROM price_histories");
    await client.query("DELETE FROM price_alerts");
    await client.query("DELETE FROM watchlists");
    await client.query("DELETE FROM cards");
    await client.query("DELETE FROM articles");
    await client.query("DELETE FROM budget_strategies");
    await client.query("DELETE FROM article_categories");
    await client.query("DELETE FROM games");
    console.log("Cleared all tables");

    // Game
    const gameId = crypto.randomUUID();
    await client.query(
      `INSERT INTO games (id, name, slug, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())`,
      [gameId, "ポケモンカード", "pokemon-card"]
    );
    console.log("Created game:", gameId);

    // Article Categories
    const catIds = {
      pokemon: crypto.randomUUID(),
      strategy: crypto.randomUUID(),
      prediction: crypto.randomUUID(),
    };
    const categories = [
      [catIds.pokemon, "ポケモンカード", "pokemon-card", "ポケモンカードに関する最新情報", 1],
      [catIds.strategy, "投資戦略", "investment-strategy", "カード投資の戦略・テクニック", 2],
      [catIds.prediction, "高騰予想", "price-prediction", "今後の値上がりが期待できるカードの予想", 3],
    ];
    for (const [id, name, slug, desc, sort] of categories) {
      await client.query(
        `INSERT INTO article_categories (id, name, slug, description, sort_order, created_at) VALUES ($1,$2,$3,$4,$5,NOW())`,
        [id, name, slug, desc, sort]
      );
    }
    console.log("Inserted categories");

    // Budget Strategies
    const strategyIds = [];
    const strategies = [
      [10000, "1万円コース", "少額から始める投資の第一歩。確実に価値を保つカードを厳選しました。", "## 1万円コースの基本方針\n\n少額でも確実にリターンを得るため、以下のポイントを重視します。\n\n### 購入基準\n- 人気キャラクターの低〜中価格帯カード\n- AR（アートレア）やR以上のレアリティ\n- 未再録の可能性が高いカード\n\n### リスク管理\n- 1枚あたり3,000〜8,000円の価格帯で2〜3枚に分散\n- 状態の良い品を優先（NM以上）\n\n### 期待リターン\n- 6ヶ月〜1年で+20〜40%を目指す", 1],
      [50000, "5万円コース", "バランスの良いポートフォリオを組めます。確実性と成長性を両立させた構成です。", "## 5万円コースの基本方針\n\n中級者向けの分散投資で、安定と成長をバランスよく狙います。\n\n### 構成比率\n- 安定枠（60%）: 人気キャラのSR・HR\n- 成長枠（30%）: 注目度が上がりそうなSA\n- 投機枠（10%）: 未開封パック\n\n### 期待リターン\n- 1年で+30〜60%を目指す", 2],
      [100000, "10万円コース", "プレミアムカードと未開封BOXのバランス型。30周年に向けて大きな値上がりを狙えます。", "## 10万円コースの基本方針\n\n高額カードを中心に、未開封BOXも加えた本格的なポートフォリオです。\n\n### 構成比率\n- メインカード（50%）: S〜Aランクの高額SA\n- サブカード（30%）: 成長期待の中価格帯\n- 未開封BOX（20%）: 長期的な希少価値\n\n### 期待リターン\n- 1〜2年で+50〜100%を目指す", 3],
      [150000, "15万円コース", "本格的な投資を始めるならこのコース。高額カードと未開封BOXで確実な資産形成。", "## 15万円コースの基本方針\n\nプレミアムカードを中心に据え、確実な資産形成を目指します。\n\n### 構成比率\n- プレミアム枠（40%）: PSA10鑑定済み高額カード\n- メインカード（35%）: SランクのSA・HR\n- 分散枠（25%）: 未開封BOX + 成長カード\n\n### 期待リターン\n- 1〜3年で+80〜150%を目指す", 4],
    ];
    for (const [budget, title, desc, content, sort] of strategies) {
      const id = crypto.randomUUID();
      strategyIds.push({ id, budget });
      await client.query(
        `INSERT INTO budget_strategies (id, budget_amount, title, description, content, is_premium, game_id, sort_order, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,false,$6,$7,NOW(),NOW())`,
        [id, budget, title, desc, content, gameId, sort]
      );
    }
    console.log("Inserted strategies");

    // Cards (25 cards)
    const cardData = [
      { name: "リザードンV（SA）", price: 120000, rating: "S", code: "s8b-173", rarity: "SR", set: "VMAXクライマックス", reason: "ポケモンカードの顔。30周年に向けて再評価される可能性大。PSA10の鑑定枚数も限定的で希少性が高い。", featured: true },
      { name: "ピカチュウVMAX（HR）", price: 45000, rating: "A", code: "s4-114", rarity: "HR", set: "仰天のボルテッカー", reason: "人気キャラで需要が安定。海外市場でも需要が高く、長期的に値下がりリスクが低い。", featured: true },
      { name: "ミュウV（SA）", price: 89000, rating: "S", code: "s8b-169", rarity: "SR", set: "VMAXクライマックス", reason: "かわいらしいイラストと強さで男女問わず人気。未再録の可能性が高い。", featured: true },
      { name: "ルギアV（SA）", price: 15000, rating: "B", code: "s11-186", rarity: "SR", set: "ロストアビス", reason: "人気伝説ポケモンだが、供給が比較的多い。長期保有向き。", featured: false },
      { name: "メイ（SR）", price: 180000, rating: "S", code: "bw8-080", rarity: "SR", set: "ライデンナックル", reason: "サポートカードの中でもトップクラスの人気。女性サポートは希少で値下がりしにくい。", featured: true },
      { name: "エーフィV（SA）", price: 35000, rating: "A", code: "s6a-041", rarity: "SR", set: "イーブイヒーローズ", reason: "イーブイフレンズ人気の牽引役。ブイズ全般が強い中でも上位人気。", featured: false },
      { name: "リザードンVSTAR（UR）", price: 250000, rating: "S", code: "s12a-099", rarity: "UR", set: "VSTARユニバース", reason: "リザードンの最上位レアリティ。未再録の可能性が極めて高く、海外市場でも最高額を記録。", featured: true },
      { name: "ピカチュウV（SA）", price: 68000, rating: "A", code: "s4a-221", rarity: "SR", set: "シャイニースターV", reason: "ブルースカイの背景が美しい。ピカチュウ人気の高まりで安定した値上がり。", featured: false },
      { name: "ミュウツーV（SA）", price: 150000, rating: "S", code: "s12a-026", rarity: "SR", set: "VSTARユニバース", reason: "初代最強ポケモン。30周年に向けて懐かしさと強さで再評価必至。", featured: true },
      { name: "ブラッキーVMAX（SA）", price: 42000, rating: "A", code: "s6a-076", rarity: "SR", set: "イーブイヒーローズ", reason: "クールなデザインが人気。女性ファンからも絶大な支持を受けている。", featured: false },
      { name: "ニンフィアVMAX（SA）", price: 38000, rating: "B", code: "s6a-093", rarity: "SR", set: "イーブイヒーローズ", reason: "女性ファンの圧倒的人気。かわいらしさと儚さが魅力の一枚。", featured: false },
      { name: "シャイニーミュウ", price: 220000, rating: "S", code: "s4a-279", rarity: "SSR", set: "シャイニースターV", reason: "限定カード。ホロ仕様が美しく、コレクションの中でもトップクラスの資産価値。", featured: true },
      { name: "リザードンex（SR）", price: 85000, rating: "A", code: "sv1s-125", rarity: "SR", set: "スカーレットex", reason: "新時代のリザードン。デザイン刷新で若い層にも人気。長期的に値上がりの可能性大。", featured: false },
      { name: "ルギアVSTAR（SA）", price: 55000, rating: "A", code: "s12a-139", rarity: "SR", set: "VSTARユニバース", reason: "伝説の銀色の翼。VSTARパワーと美麗なイラストで人気急上昇。", featured: false },
      { name: "コイキング（AR）", price: 8000, rating: "B", code: "s11a-071", rarity: "AR", set: "白熱のアルカナ", reason: "コミカルで愛らしいデザイン。低価格帯でコレクションしやすい穴場カード。", featured: false },
      { name: "グレイシアVMAX（SA）", price: 45000, rating: "A", code: "s6a-084", rarity: "SR", set: "イーブイヒーローズ", reason: "冷色調の美麗なイラスト。季節感と相まって価値が高まる可能性。", featured: false },
      { name: "リーリエ（SR）", price: 350000, rating: "S", code: "sm1m-066", rarity: "SR", set: "コレクションサン", reason: "女性サポートカードの最高峰。プレミアムな一枚、状態によっては50万円超えも。", featured: true },
      { name: "リザードンV（PSA10）", price: 180000, rating: "S", code: "s1a-202", rarity: "SR", set: "VMAXライジング", reason: "PSA10保証付きで安心。リザードンの人気は不動、値下がりリスクが極めて低い。", featured: false },
      { name: "カイリューV（SA）", price: 32000, rating: "A", code: "s11-174", rarity: "SR", set: "ロストアビス", reason: "初代最強進化系。ドラゴンタイプの中でも美麗なイラストで人気。", featured: false },
      { name: "ピカチュウVMAX（PSA10）", price: 55000, rating: "A", code: "s4a-283", rarity: "SSR", set: "シャイニースターV", reason: "PSA10鑑定済み。ピカチュウは需要が最も安定している安全資産。", featured: false },
      { name: "レックウザVMAX（SA）", price: 72000, rating: "A", code: "s7R-083", rarity: "SR", set: "蒼空ストリーム", reason: "金色の龍が圧巻のデザイン。レックウザの人気は世代を問わず強い。", featured: true },
      { name: "ガラルファイヤーV（SA）", price: 28000, rating: "B", code: "s5a-044", rarity: "SR", set: "双璧のファイター", reason: "ダークタイプの美麗イラスト。入手難易度が上がっており、今後の高騰に期待。", featured: false },
      { name: "アセロラの予感（SR）", price: 95000, rating: "A", code: "s8b-148", rarity: "SR", set: "VMAXクライマックス", reason: "女性サポート人気の典型。美しいイラストで長期的な需要が見込める。", featured: false },
      { name: "マリィ（SR）", price: 125000, rating: "S", code: "s4a-198", rarity: "SR", set: "シャイニースターV", reason: "圧倒的なファン人気。供給が限られており、値上がりが続いている。", featured: true },
      { name: "古代の咆哮 BOX（未開封）", price: 5500, rating: "B", code: "sv4K-BOX", rarity: "BOX", set: "古代の咆哮", reason: "未開封BOXの希少性。生産終了後は年々価格が上昇する傾向。少額分散投資に最適。", featured: false },
    ];

    const cardIds = [];
    for (const c of cardData) {
      const id = crypto.randomUUID();
      cardIds.push({ id, ...c });
      await client.query(
        `INSERT INTO cards (id, name, image_url, current_price, rating, game_id, card_code, rarity, set_name, release_date, reason, is_featured, status, created_at, updated_at) VALUES ($1,$2,NULL,$3,$4,$5,$6,$7,$8,NULL,$9,$10,'active',NOW(),NOW())`,
        [id, c.name, c.price, c.rating, gameId, c.code, c.rarity, c.set, c.reason, c.featured]
      );
    }
    console.log(`Inserted ${cardData.length} cards`);

    // Strategy Card Items
    const s10k = strategyIds.find(s => s.budget === 10000);
    const s50k = strategyIds.find(s => s.budget === 50000);
    const s100k = strategyIds.find(s => s.budget === 100000);
    const s150k = strategyIds.find(s => s.budget === 150000);

    const findCard = (name) => cardIds.find(c => c.name.includes(name));

    const stratItems = [
      // 1万円コース
      { stratId: s10k.id, cardName: "コイキング", qty: 1, sort: 1, desc: "低価格帯の穴場。コレクション需要で値上がり期待" },
      { stratId: s10k.id, cardName: "古代の咆哮", qty: 1, sort: 2, desc: "未開封BOXは年々価値が上がる安定資産" },
      // 5万円コース
      { stratId: s50k.id, cardName: "ピカチュウVMAX（HR）", qty: 1, sort: 1, desc: "安定の人気キャラ。値下がりリスクが低い" },
      { stratId: s50k.id, cardName: "コイキング", qty: 1, sort: 2, desc: "分散枠として少額カードも組み入れ" },
      { stratId: s50k.id, cardName: "古代の咆哮", qty: 2, sort: 3, desc: "未開封BOXで資産のベースを固める" },
      // 10万円コース
      { stratId: s100k.id, cardName: "ミュウV", qty: 1, sort: 1, desc: "メイン枠。高い成長期待" },
      { stratId: s100k.id, cardName: "カイリュー", qty: 1, sort: 2, desc: "サブ枠。中価格帯で成長余地あり" },
      { stratId: s100k.id, cardName: "古代の咆哮", qty: 2, sort: 3, desc: "未開封BOXで分散投資" },
      // 15万円コース
      { stratId: s150k.id, cardName: "リザードンV（SA）", qty: 1, sort: 1, desc: "プレミアム枠。30周年で爆上がりを狙う" },
      { stratId: s150k.id, cardName: "ブラッキーVMAX", qty: 1, sort: 2, desc: "安定した人気。値下がりリスク低い" },
      { stratId: s150k.id, cardName: "古代の咆哮", qty: 2, sort: 3, desc: "未開封BOXで残りの資金を活用" },
    ];

    for (const item of stratItems) {
      const card = findCard(item.cardName);
      if (card) {
        await client.query(
          `INSERT INTO strategy_card_items (id, strategy_id, card_id, recommended_qty, sort_order, description) VALUES ($1,$2,$3,$4,$5,$6)`,
          [crypto.randomUUID(), item.stratId, card.id, item.qty, item.sort, item.desc]
        );
      }
    }
    console.log("Inserted strategy card items");

    // Articles (12 articles)
    const articles = [
      {
        title: "【2026年版】ポケモン30周年に向けて仕込むべきカード5選",
        slug: "pokemon-30th-anniversary-top5",
        catId: catIds.prediction,
        content: `## 2026年ポケモン30周年

2026年にポケモン30周年を迎えるにあたり、市場はすでに動き始めています。今回は、今から仕込んでおくべき注目カードを5枚厳選しました。

### 1. リザードンVSTAR（UR）

現在価格: ¥250,000 / 評価: Sランク

リザードンの最上位レアリティ。未再録の可能性が極めて高く、30周年のお祝いムードで更なる高騰が予想されます。

### 2. ミュウツーV（SA）

現在価格: ¥150,000 / 評価: Sランク

初代最強ポケモン。映画のリメイクや新作ゲームのタイミングで再度注目される可能性があります。

### 3. リーリエ（SR）

現在価格: ¥350,000 / 評価: Sランク

サポートカード市場で不動の地位。コレクターからの需要が年々増加しています。

### 4. シャイニーミュウ

現在価格: ¥220,000 / 評価: Sランク

限定生産のホロ仕様。既にプレミアム価格ですが、30周年で更に値上がりする可能性大。

### 5. マリィ（SR）

現在価格: ¥125,000 / 評価: Sランク

ゲーム内でも圧倒的な人気を誇るキャラクター。供給の減少で今後も値上がりが続く見込み。

## まとめ

30周年に向けて「初代」「人気キャラ」「限定生産」の3つのキーワードでカードを選ぶのがポイントです。`,
      },
      {
        title: "初心者が最初に買うべきカードガイド【完全版】",
        slug: "beginners-first-card-guide",
        catId: catIds.strategy,
        content: `## はじめに

ポケモンカード投資を始めたいけど、何を買えばいいか分からない。そんな悩みを持つ人は多いです。この記事では、初心者が最初に選ぶべきカードの基準を解説します。

### ポイント1: 人気キャラクターを中心に選ぶ

リザードン、ピカチュウ、ミュウなど、知名度の高いキャラクターのカードは需要が安定しています。流行に左右されにくく、初心者でもリスクが低いです。

### ポイント2: 状態（PSA10）にこだわる

同じカードでも、状態の違いで価格が数倍変わります。NM（ニアミント）以上の状態のカードを選びましょう。

### ポイント3: 予算を決めて分散投資

1枚に全額投資するのではなく、2〜3枚に分散するのが安全です。1万円なら3,000〜5,000円のカードを2〜3枚が目安。

### ポイント4: 未再録のカードを優先する

再録（再販）されたカードは供給が増えて価格が下がります。「もう手に入らない」カードほど価値が上がります。

## おすすめの最初の1枚

初心者には「ピカチュウVMAX（HR）」をおすすめします。人気キャラ×安定した需要で、値下がりリスクが最小です。`,
      },
      {
        title: "PSA10の買い方・保存の完全ガイド",
        slug: "psa10-complete-guide",
        catId: catIds.pokemon,
        content: `## PSA10とは

PSA（Professional Sports Authenticator）による最高グレードです。カードの状態が完璧であることを証明しています。

### PSA10のメリット

- 真贋証明がついているため安心
- 状態が保証されているので価値が安定
- 海外市場でも取引しやすい

## 購入時のポイント

### 信頼できるショップで買う

メルカリやヤフオクではなく、カードショップの公式サイトや大手通販を利用しましょう。

### ケースの状態も確認

PSAケースに傷やヒビがないか確認。ケース交換（リホルダー）の履歴があるものは避けましょう。

## 保存のポイント

### 1. 直射日光を避ける
UV光でカードが退色します。暗所に保管しましょう。

### 2. 湿度管理（40-60%が理想）
湿度が高すぎるとカビ、低すぎると反りの原因に。

### 3. 温度変化を避ける
急激な温度変化で結露が発生し、カードを傷めます。

### 4. 防湿庫がベスト
カメラ用の防湿庫が最適。数千円から購入可能です。`,
      },
      {
        title: "【2026年6月】今月の高騰ランキングTOP5",
        slug: "monthly-ranking-june-2026",
        catId: catIds.prediction,
        content: `## 今月の高騰ランキング

6月はポケモン30周年関連のニュースが複数出たことで、初代ポケモン関連カードが全面的に高騰しています。

### 1位：リザードンVSTAR（UR） +18.5%

前月比: ¥211,000 → ¥250,000

30周年プロモーション発表による波及効果。海外バイヤーの買い付けも活発化。

### 2位：ミュウツーV（SA） +14.2%

前月比: ¥131,000 → ¥150,000

映画リメイクの噂が浮上。初代世代の懐かしさで需要が急増。

### 3位：マリィ（SR） +11.6%

前月比: ¥112,000 → ¥125,000

海外でのトレーナーカード人気が国内にも波及。

### 4位：レックウザVMAX（SA） +9.8%

前月比: ¥65,500 → ¥72,000

ドラゴンポケモン特集記事の影響で注目度アップ。

### 5位：アセロラの予感（SR） +8.0%

前月比: ¥88,000 → ¥95,000

女性サポートカード全体が堅調な値動き。

## 来月の展望

7月はポケモンデーに向けた公式発表が予想されるため、引き続き初代関連が強い見込みです。`,
      },
      {
        title: "5万円で作る最強ポートフォリオ【2026年版】",
        slug: "5man-portfolio-2026",
        catId: catIds.strategy,
        content: `## 5万円で最大リターンを狙う

5万円あれば、プロ級のポートフォリオが組めます。この記事では、実際の構成例と考え方を解説します。

### 基本戦略: 3分割法

- メイン（60%: 30,000円）: 安定した人気カード1枚
- サブ（30%: 15,000円）: 成長期待のカード1〜2枚
- 分散（10%: 5,000円）: 未開封パックや低額カード

### 具体的な構成例

#### メイン: ピカチュウVMAX（HR）¥45,000 → 1枚

安定した人気で値下がりリスクが最小。ピカチュウは世界的に需要があり、為替の恩恵も受けやすい。

#### サブ: カイリューV（SA）¥32,000の代わりに…

予算を考慮して、ガラルファイヤーV（SA）¥28,000がおすすめ。ダークタイプの美麗イラストで、今後の値上がりに期待。

#### 分散: 古代の咆哮 BOX ¥5,500 × 1

未開封BOXは年々希少性が増すため、長期保有で確実にリターンが見込めます。

## リスク管理のポイント

- 1枚に全額投資しない
- 購入後すぐに売らない（最低3ヶ月は保有）
- 市場ニュースを定期的にチェック`,
      },
      {
        title: "イーブイヒーローズ全種SA完全ガイド",
        slug: "eevee-heroes-sa-guide",
        catId: catIds.pokemon,
        content: `## イーブイヒーローズとは

2021年5月発売の拡張パック。イーブイの進化系8種のスペシャルアート（SA）が収録され、ポケモンカード史上最も人気の高いパックの一つです。

### 各SA の現在価格と評価

#### ブラッキーVMAX（SA）- ¥42,000 / Aランク
クールなデザインが圧倒的人気。男女ともにファンが多い。

#### グレイシアVMAX（SA）- ¥45,000 / Aランク
冷色調の美麗イラスト。冬の季節に需要が高まる傾向。

#### ニンフィアVMAX（SA）- ¥38,000 / Bランク
女性ファンに圧倒的人気。供給量がやや多いため伸び悩み。

#### エーフィV（SA）- ¥35,000 / Aランク
太陽の光を浴びるエーフィが美しい。

### 投資としてのイーブイヒーローズ

未開封BOXは現在¥80,000前後。パック単位でも¥3,000以上の値がつきます。発売から5年が経過し、供給が急減しているため、今後も値上がりが期待できます。

## まとめ

イーブイヒーローズのSAは、どれを選んでも大外れがない安定した投資先です。特にブラッキーVMAXとグレイシアVMAXが成長余地が大きいと見ています。`,
      },
      {
        title: "未開封BOX投資の基本とおすすめパック",
        slug: "sealed-box-investment-guide",
        catId: catIds.strategy,
        content: `## 未開封BOX投資とは

パックを開けずにBOXのまま保管し、生産終了後の希少性で値上がりを狙う投資手法です。

### メリット

- カード1枚の当たり外れに左右されない
- 生産終了後は確実に供給が減る
- 保管が比較的簡単（スリーブ不要）
- 少額から始められる

### デメリット

- 保管スペースが必要
- 値上がりまでに時間がかかる（1〜3年）
- シュリンク（外装フィルム）の状態管理が必要

## 投資におすすめのBOX

### 1. 古代の咆哮 / 未来の一閃（¥5,500前後）

現行パックで入手しやすい。生産終了後の値上がりに期待。

### 2. VSTARユニバース（¥15,000前後）

高レアリティカードを多数収録。既に値上がり傾向。

### 3. イーブイヒーローズ（¥80,000前後）

既にプレミアム価格だが、まだ上がる余地あり。

## 保管のポイント

- シュリンクの破れや傷に注意
- 直射日光を避ける
- 積み重ねすぎない（BOXが歪む）
- 防湿庫がベスト`,
      },
      {
        title: "女性サポートカードが高い理由と今後の展望",
        slug: "female-supporter-cards-analysis",
        catId: catIds.prediction,
        content: `## 女性サポートカードとは

ポケモンカードに登場する女性トレーナーのサポートカード。リーリエ、マリィ、メイ、アセロラなどが代表的です。

### なぜ高いのか

#### 1. コレクション需要が強い
プレイ用途以外に、イラスト目的で収集するファンが多い。

#### 2. 供給が限られている
古いパックに収録されたものは再録されにくく、供給が年々減少。

#### 3. 海外需要
日本のアニメ文化への関心から、海外コレクターの需要も旺盛。

### 現在の主要カード価格

- リーリエ（SR）: ¥350,000
- メイ（SR）: ¥180,000
- マリィ（SR）: ¥125,000
- アセロラの予感（SR）: ¥95,000

### 今後の展望

新しいゲームやアニメの女性キャラクターカードは、発売直後から高値がつく傾向があります。「最初の1枚目のSR」を素早く確保するのが勝ちパターンです。

## まとめ

女性サポートカードは、ポケモンカード投資の中でも最も安定したジャンルです。価格が高い分、値下がりリスクも低いという特徴があります。`,
      },
      {
        title: "ポケモンカード投資で失敗しないための7つのルール",
        slug: "7-rules-not-to-fail",
        catId: catIds.strategy,
        content: `## はじめに

ポケモンカード投資で損をする人には共通点があります。この記事では、失敗を防ぐための7つのルールを紹介します。

### ルール1: 流行に乗って高値掴みしない

SNSで話題になったカードはすでに高騰済み。「みんなが買い始めた時」ではなく「まだ注目されていない時」に買うのが鉄則。

### ルール2: 1枚に全額投資しない

どんなに有望なカードでも、予算の50%以上を1枚に使わないこと。

### ルール3: 損切りラインを決めておく

購入価格から20%以上下がったら売却を検討。塩漬けにしない。

### ルール4: 保管環境を整える

せっかくの投資が保管ミスで台無しになるケースが多い。防湿庫を用意しましょう。

### ルール5: 偽物に注意する

メルカリやヤフオクでの個人取引は偽物リスクあり。信頼できるショップで購入を。

### ルール6: 短期売買をしない

カード投資は最低3ヶ月〜1年の中長期が基本。短期で売買するとスプレッド（買値と売値の差）で損します。

### ルール7: 情報源を3つ以上持つ

1つの情報源だけを信じない。Twitter、YouTube、カードショップの相場、海外サイトなど複数でクロスチェック。

## まとめ

これらのルールを守るだけで、大きな失敗は防げます。まずは少額から始めて、経験を積みましょう。`,
      },
      {
        title: "海外市場の動向とカード投資への影響",
        slug: "overseas-market-impact",
        catId: catIds.prediction,
        content: `## 海外市場が日本のカード価格に与える影響

ポケモンカードの市場は今やグローバルです。海外の動向が国内価格に直結するケースが増えています。

### 注目ポイント1: 円安の恩恵

円安が進むと、海外バイヤーにとって日本のカードが「お得」になります。実際に2024-2025年の円安局面では、海外向け販売が急増しました。

### 注目ポイント2: 英語版との価格差

同じイラストでも、日本語版と英語版で価格が異なります。一般的に日本語版の方がプレミアムが付きやすい傾向があります。

### 注目ポイント3: 海外で人気のカード

- リザードン系: 世界共通で最高人気
- 女性トレーナー: 日本文化への関心から需要増
- 初代ポケモン: ノスタルジー需要

### 海外市場の価格チェック方法

- TCGPlayer（アメリカ最大のカード通販）
- eBay（オークション形式で実勢価格が分かる）
- Cardmarket（ヨーロッパ市場）

## まとめ

海外市場の動向を把握することで、先回りした投資判断が可能になります。特に円安局面では、海外人気の高いカードが狙い目です。`,
      },
      {
        title: "VSTARユニバース完全攻略ガイド",
        slug: "vstar-universe-guide",
        catId: catIds.pokemon,
        content: `## VSTARユニバースとは

2022年12月発売のハイクラスパック。歴代の人気カードがリメイクされて収録されており、「神パック」と呼ばれています。

### 注目カード

#### リザードンVSTAR（UR）- ¥250,000
パックの顔。最上位レアリティで希少性が極めて高い。

#### ミュウツーV（SA）- ¥150,000
初代最強ポケモンの美しいスペシャルアート。

#### ルギアVSTAR（SA）- ¥55,000
銀色の翼が美しい伝説ポケモン。

### BOXの投資価値

現在のBOX価格は約¥15,000。発売直後は¥5,500だったため、約3倍に値上がりしています。

今後も生産終了により供給が減るため、さらなる値上がりが期待できます。

### 購入時の注意点

- シュリンク付きの未開封BOXを選ぶ
- シュリンクに「再シュリンク」の痕跡がないか確認
- 信頼できるショップで購入する

## まとめ

VSTARユニバースはカード投資の教科書的なパック。BOXで買っても、バラで人気カードを狙っても、どちらも投資として成立します。`,
      },
      {
        title: "カード投資のリスクと対策まとめ",
        slug: "card-investment-risks",
        catId: catIds.strategy,
        content: `## カード投資のリスク

どんな投資にもリスクはあります。ポケモンカード投資特有のリスクと対策を解説します。

### リスク1: 再録（再販）リスク

人気カードが新しいパックに再収録されると、供給が増えて価格が下落します。

**対策**: 「再録されにくいカード」を選ぶ。旧裏面、絶版パック限定カードなど。

### リスク2: 偽物リスク

高額カードほど偽物が出回ります。特にメルカリ等の個人間取引で多発。

**対策**: PSA鑑定済みを購入、または信頼できるカードショップを利用。

### リスク3: 保管リスク

水濡れ、日焼け、折れなどでカードの価値が大幅に下がります。

**対策**: 防湿庫+UVカットケースで保管。スリーブ→ローダー→ケースの3重保護。

### リスク4: 流動性リスク

売りたい時にすぐ売れない、または想定より安い価格でしか売れない場合があります。

**対策**: 人気キャラ・定番カードを中心に投資。マイナーカードは避ける。

### リスク5: トレンド変化リスク

ポケモン自体の人気が下がれば、カード全体の価値が下がる可能性。

**対策**: ポケモンは30年の歴史があり、急激な人気低下は考えにくい。ただし一応の分散として、他の資産も持つ。

## まとめ

リスクを理解した上で、「人気キャラ×希少性×良好な状態」の3条件を満たすカードを選べば、大きな失敗は防げます。`,
      },
    ];

    for (const a of articles) {
      const daysAgo = Math.floor(Math.random() * 30);
      const publishedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      await client.query(
        `INSERT INTO articles (id, title, slug, content, category_id, featured_image, is_published, is_premium, published_at, meta_title, meta_description, view_count, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,NULL,true,false,$6,NULL,NULL,$7,$8,$8)`,
        [crypto.randomUUID(), a.title, a.slug, a.content, a.catId, publishedAt, Math.floor(Math.random() * 500) + 50, publishedAt]
      );
    }
    console.log(`Inserted ${articles.length} articles`);

    // Admin user (password: admin123)
    const bcrypt = require("bcryptjs");
    const adminId = crypto.randomUUID();
    const hash = await bcrypt.hash("admin123", 10);
    await client.query(
      `INSERT INTO users (id, email, password_hash, name, role, email_verified, is_premium, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,true,true,NOW(),NOW()) ON CONFLICT (email) DO NOTHING`,
      [adminId, "admin@card-alpha.jp", hash, "管理者", "admin"]
    );
    console.log("Admin user created (admin@card-alpha.jp / admin123)");

    await client.query("COMMIT");
    console.log("\n=== Seed Complete ===");
    console.log(`Cards: ${cardData.length}`);
    console.log(`Articles: ${articles.length}`);
    console.log(`Strategies: ${strategies.length}`);
    console.log(`Categories: ${categories.length}`);
    console.log(`Strategy Items: ${stratItems.length}`);
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Seed failed:", e);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
