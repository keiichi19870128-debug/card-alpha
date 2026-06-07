/**
 * Add Stripe-related columns to users table
 * Usage: node scripts/migrate-stripe.js
 */
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:kei018719kei@db.thiqkihrccoiqcfmvdhj.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
      ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
    `);
    console.log("Added stripe_customer_id and stripe_subscription_id columns");
  } catch (e) {
    console.error("Migration failed:", e.message);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
