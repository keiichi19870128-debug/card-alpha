import { getServerSession } from "next-auth";
import { getDb } from "@/lib/db";

/**
 * Check if the current user has premium access.
 * Returns the user object if premium, null otherwise.
 */
export async function checkPremiumAccess(): Promise<{ isPremium: boolean; userId: string | null }> {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return { isPremium: false, userId: null };
  }

  const db = getDb();
  const { rows } = await db.query(
    "SELECT id, is_premium FROM users WHERE email = $1",
    [session.user.email]
  );
  const user = rows[0];
  if (!user) return { isPremium: false, userId: null };

  return { isPremium: user.is_premium, userId: user.id };
}
