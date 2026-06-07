const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:kei018719kei@db.thiqkihrccoiqcfmvdhj.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Clear existing cards to avoid duplicates
    await client.query("DELETE FROM cards");
    console.log("Cleared existing cards");

    // Get existing game id
    const { rows: gameRows } = await client.query("SELECT id FROM games LIMIT 1");
    let gameId;
    if (gameRows.length > 0) {
      gameId = gameRows[0].id;
      console.log("Using existing game:", gameId);
    } else {
      gameId = crypto.randomUUID();
      await client.query(
        `INSERT INTO games (id, name, slug, "logoUrl", "isActive", created_at, updated_at) VALUES ($1,$2,$3,null,true,NOW(),NOW())`,
        [gameId, "ポケモンカード", "pokemon-card"]
      );
      console.log("Created new game:", gameId);
    }

    // article_categories - skip if already exists
    try {
      const { rows } = await client.query("SELECT COUNT(*) as c FROM article_categories");
      if (parseInt(rows[0].c, 10) === 0) {
        const cats = [
          ["ポケモンカード", "pokemon-card", 1],
          ["投資戦略", "investment-strategy", 2],
          ["高騰予想", "price-prediction", 3],
        ];
        for (const [name, slug, sort] of cats) {
          await client.query(
            `INSERT INTO article_categories (id, name, slug, sort_order, created_at) VALUES ($1,$2,$3,$4,NOW())`,
            [crypto.randomUUID(), name, slug, sort]
          );
        }
        console.log("Inserted article_categories");
      } else {
        console.log("article_categories already exist, skipping");
      }
    } catch (e) {
      console.log("article_categories skipped:", e.message);
    }

    // budget_strategies - skip duplicates
    try {
      const { rows: bsRows } = await client.query("SELECT COUNT(*) as c FROM budget_strategies");
      if (parseInt(bsRows[0].c, 10) === 0) {
        const strategies = [
          [10000, "1万円コース", "初心者向けのエントリーコース。人気カードを1～2枚狙います。", 1],
          [50000, "5万円コース", "中級者向け。複数のカードを組み合わせた分散投資が可能です。", 2],
          [100000, "10万円コース", "上級者向け。未開封BOXやPSAグレード品を検討できます。", 3],
          [150000, "15万円コース", "プレミアムコース。高額カードやセット購入が可能です。", 4],
        ];
        for (const [budget, title, desc, sort] of strategies) {
          await client.query(
            `INSERT INTO budget_strategies (id, budget_amount, title, description, content, "is_premium", game_id, sort_order, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW())`,
            [crypto.randomUUID(), budget, title, desc, `# ${title}\n\n${desc}`, false, gameId, sort]
          );
        }
        console.log("Inserted budget_strategies");
      } else {
        console.log("budget_strategies already exist, skipping");
      }
    } catch (e) {
      console.log("budget_strategies skipped:", e.message);
    }

    // sample cards with images
    const sampleCards = [
      {
        name: "リザードンV（SA）",
        price: 120000,
        rating: "S",
        reason: "30周年で再評価される可能性大",
        rarity: "SR",
        set_name: "スカーレットex",
        card_code: "001/001",
        image_url: "https://images.pokemontcg.io/swsh35/19_hires.png",
      },
      {
        name: "ピカチュウV",
        price: 85000,
        rating: "A",
        reason: "プロモ版が高騰中",
        rarity: "RR",
        set_name: "VMAXライジング",
        card_code: "043/060",
        image_url: "https://images.pokemontcg.io/swsh35/43_hires.png",
      },
      {
        name: "ミュウV",
        price: 65000,
        rating: "A",
        reason: "海外需要で人気急上昇",
        rarity: "RR",
        set_name: "フュージョンアーツ",
        card_code: "100/100",
        image_url: "https://images.pokemontcg.io/swsh36/1_hires.png",
      },
      {
        name: "ゲッコウガex",
        price: 32000,
        rating: "B",
        reason: "エースバーンとの相性が良い",
        rarity: "RR",
        set_name: "テラスタルフェス",
        card_code: "012/020",
        image_url: "https://images.pokemontcg.io/sv4a/12_hires.png",
      },
    ];

    for (const card of sampleCards) {
      await client.query(
        `INSERT INTO cards (id, name, current_price, rating, game_id, reason, rarity, set_name, card_code, image_url, "is_featured", status, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'active',NOW(),NOW())`,
        [crypto.randomUUID(), card.name, card.price, card.rating, gameId, card.reason, card.rarity, card.set_name, card.card_code, card.image_url, true]
      );
    }
    console.log("Inserted cards with images");

    await client.query("COMMIT");
    console.log("Seed complete");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
