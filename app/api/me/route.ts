import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ isPremium: false });
  }

  const db = getDb();
  const { rows } = await db.query("SELECT is_premium FROM users WHERE email = $1", [session.user.email]);
  return NextResponse.json({ isPremium: rows[0]?.is_premium ?? false });
}
