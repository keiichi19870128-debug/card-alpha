import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendPriceAlertEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Verify cron secret (Vercel Cron or manual trigger)
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  let triggered = 0;

  try {
    // Get active alerts with card and user info
    const { rows: alerts } = await db.query(`
      SELECT pa.id, pa.target_price, pa.condition, pa.user_id, pa.card_id,
             c.name as card_name, c.current_price,
             u.email
      FROM price_alerts pa
      JOIN cards c ON c.id = pa.card_id
      JOIN users u ON u.id = pa.user_id
      WHERE pa.is_active = true AND pa.triggered_at IS NULL
    `);

    for (const alert of alerts) {
      const shouldTrigger =
        (alert.condition === "below" && alert.current_price <= alert.target_price) ||
        (alert.condition === "above" && alert.current_price >= alert.target_price);

      if (shouldTrigger) {
        // Send email
        await sendPriceAlertEmail({
          to: alert.email,
          cardName: alert.card_name,
          currentPrice: alert.current_price,
          targetPrice: alert.target_price,
          condition: alert.condition,
        });

        // Mark as triggered
        await db.query(
          "UPDATE price_alerts SET triggered_at = NOW(), is_active = false WHERE id = $1",
          [alert.id]
        );
        triggered++;
      }
    }

    return NextResponse.json({
      success: true,
      checked: alerts.length,
      triggered,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
