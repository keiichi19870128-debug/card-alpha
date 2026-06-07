import { cookies } from "next/headers";

const ADMIN_PASSWORD = "cardalpha2026";

export async function verifyAdmin(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD;
}

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (token !== ADMIN_PASSWORD) {
    return false;
  }
  return true;
}
