const { Pool } = require("pg");
const pool = new Pool({
  connectionString: "postgresql://postgres:kei018719kei@db.thiqkihrccoiqcfmvdhj.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

async function run() {
  const client = await pool.connect();
  try {
    await client.query("UPDATE cards SET image_url = NULL");
    console.log("Cleared image_url");
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
    pool.end();
  }
}
run();
