const { Pool } = require("pg");

async function test() {
  const url = "postgresql://postgres.thiqkihrccoiqcfmvdhj:kei018719kei@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
  const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
  try {
    const { rows } = await pool.query("SELECT 1 as ok");
    console.log("OK", rows[0]);
    await pool.end();
  } catch (e) {
    console.error("FAIL", e.message);
    await pool.end();
    process.exit(1);
  }
}
test();
