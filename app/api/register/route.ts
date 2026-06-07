import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "メールアドレスとパスワードは必須です" }, { status: 400 });
    }

    const { rows: existing } = await getDb().query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.length > 0) {
      return NextResponse.json({ error: "このメールアドレスは既に登録されています" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);
    const id = crypto.randomUUID();
    await getDb().query(
      `INSERT INTO users (id, email, password_hash, name, role, created_at, updated_at)
       VALUES ($1,$2,$3,$4,'user',NOW(),NOW())`,
      [id, email, hash, name ?? null]
    );

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "登録に失敗しました" }, { status: 500 });
  }
}
