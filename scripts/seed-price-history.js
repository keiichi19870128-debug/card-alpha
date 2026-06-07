/**
 * 価格履歴のダミーデータを生成するスクリプト
 * 過去30日分のランダムな価格変動を各カードに追加
 *
 * Usage: node scripts/seed-price-history.js
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
    await client.query("DELETE FROM price_histories");

    const { rows: cards } = await client.query("SELECT id, current_price FROM cards WHERE status = 'active'");

    let count = 0;
    for (const card of cards) {
      const basePrice = card.current_price;
      // Generate 30 days of history
      for (let daysAgo = 30; daysAgo >= 0; daysAgo--) {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        date.setHours(0, 0, 0, 0);

        // Random fluctuation: -8% to +8% from base, trending toward current price
        const progress = (30 - daysAgo) / 30; // 0 -> 1
        const startVariation = (Math.random() - 0.5) * 0.16; // up to +-8%
        const startPrice = Math.round(basePrice * (1 + startVariation * (1 - progress)));
        // Blend toward current price
        const price = Math.round(startPrice * (1 - progress) + basePrice * progress);

        await client.query(
          `INSERT INTO price_histories (id, card_id, price, recorded_at, source, created_at)
           VALUES ($1, $2, $3, $4, 'seed', NOW())
           ON CONFLICT (card_id, recorded_at) DO UPDATE SET price = $3`,
          [crypto.randomUUID(), card.id, price, date]
        );
        count++;
      }
    }

    await client.query("COMMIT");
    console.log(`Inserted ${count} price history records for ${cards.length} cards`);
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Failed:", e);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
