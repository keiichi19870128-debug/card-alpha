import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getDb } from "@/lib/db";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const db = getDb();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      if (userId) {
        await db.query(
          "UPDATE users SET is_premium = true, stripe_subscription_id = $1, updated_at = NOW() WHERE id = $2",
          [session.subscription, userId]
        );
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;
      await db.query(
        "UPDATE users SET is_premium = false, stripe_subscription_id = NULL, updated_at = NOW() WHERE stripe_customer_id = $1",
        [customerId]
      );
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;
      const isActive = ["active", "trialing"].includes(subscription.status);
      await db.query(
        "UPDATE users SET is_premium = $1, updated_at = NOW() WHERE stripe_customer_id = $2",
        [isActive, customerId]
      );
      break;
    }
  }

  return NextResponse.json({ received: true });
}
