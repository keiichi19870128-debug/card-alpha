import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { stripe, PLANS } from "@/lib/stripe";
import { getDb } from "@/lib/db";

export async function POST() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const { rows } = await db.query("SELECT id, stripe_customer_id FROM users WHERE email = $1", [session.user.email]);
  const user = rows[0];
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get or create Stripe customer
  let customerId = user.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      name: session.user.name || undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await db.query("UPDATE users SET stripe_customer_id = $1 WHERE id = $2", [customerId, user.id]);
  }

  // Create checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: PLANS.premium.priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/mypage?upgraded=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/pricing`,
    metadata: { userId: user.id },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
