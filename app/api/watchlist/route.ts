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
    `SELECT w.id, w.card_id, w.created_at, c.name, c.current_price, c.rating, c.image_url
     FROM watchlists w
     JOIN cards c ON c.id = w.card_id
     WHERE w.user_id = $1
     ORDER BY w.created_at DESC`,
    [user[0].id]
  );

  return NextResponse.json({ items: rows });
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cardId } = await req.json();
  if (!cardId) return NextResponse.json({ error: "cardId required" }, { status: 400 });

  const db = getDb();
  const { rows: user } = await db.query("SELECT id FROM users WHERE email = $1", [session.user.email]);
  if (!user[0]) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Check duplicate
  const { rows: existing } = await db.query(
    "SELECT id FROM watchlists WHERE user_id = $1 AND card_id = $2",
    [user[0].id, cardId]
  );

  if (existing.length > 0) {
    // Remove (toggle off)
    await db.query("DELETE FROM watchlists WHERE id = $1", [existing[0].id]);
    return NextResponse.json({ action: "removed" });
  }

  // Add
  await db.query(
    "INSERT INTO watchlists (id, user_id, card_id, created_at) VALUES ($1, $2, $3, NOW())",
    [crypto.randomUUID(), user[0].id, cardId]
  );
  return NextResponse.json({ action: "added" });
}
