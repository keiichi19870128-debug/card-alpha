import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const { rows: user } = await db.query("SELECT id FROM users WHERE email = $1", [session.user.email]);
  if (!user[0]) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { rows } = await db.query(
    `SELECT pa.id, pa.card_id, pa.target_price, pa.condition, pa.is_active, pa.triggered_at, pa.created_at,
            c.name as card_name, c.current_price
     FROM price_alerts pa
     JOIN cards c ON c.id = pa.card_id
     WHERE pa.user_id = $1
     ORDER BY pa.created_at DESC`,
    [user[0].id]
  );

  return NextResponse.json({ alerts: rows });
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cardId, targetPrice, condition } = await req.json();
  if (!cardId || !targetPrice || !condition) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (!["above", "below"].includes(condition)) {
    return NextResponse.json({ error: "condition must be 'above' or 'below'" }, { status: 400 });
  }

  const db = getDb();
  const { rows: user } = await db.query("SELECT id, is_premium FROM users WHERE email = $1", [session.user.email]);
  if (!user[0]) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Free users: max 3 alerts, premium: unlimited
  if (!user[0].is_premium) {
    const { rows: count } = await db.query(
      "SELECT COUNT(*) as c FROM price_alerts WHERE user_id = $1 AND is_active = true",
      [user[0].id]
    );
    if (parseInt(count[0].c, 10) >= 3) {
      return NextResponse.json({ error: "Free plan is limited to 3 active alerts. Upgrade to premium for unlimited." }, { status: 403 });
    }
  }

  await db.query(
    `INSERT INTO price_alerts (id, user_id, card_id, target_price, condition, is_active, created_at)
     VALUES ($1, $2, $3, $4, $5, true, NOW())`,
    [crypto.randomUUID(), user[0].id, cardId, targetPrice, condition]
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { alertId } = await req.json();
  if (!alertId) return NextResponse.json({ error: "alertId required" }, { status: 400 });

  const db = getDb();
  const { rows: user } = await db.query("SELECT id FROM users WHERE email = $1", [session.user.email]);
  if (!user[0]) return NextResponse.json({ error: "User not found" }, { status: 404 });

  await db.query("DELETE FROM price_alerts WHERE id = $1 AND user_id = $2", [alertId, user[0].id]);
  return NextResponse.json({ success: true });
}
