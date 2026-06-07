import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ADMIN_PASSWORD = "cardalpha2026";

export async function POST(request: Request) {
  const { password } = await request.json();
  if (password === ADMIN_PASSWORD) {
    (await cookies()).set("admin-token", ADMIN_PASSWORD, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false }, { status: 401 });
}
