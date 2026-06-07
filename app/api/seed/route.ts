import { NextResponse } from "next/server";
import { getFeaturedCards, getPublishedArticles, getAllStrategies } from "@/lib/db";

export const dynamic = "force-static";

export async function GET() {
  const cards = await getFeaturedCards(4);
  const articles = await getPublishedArticles(3);
  const strategies = await getAllStrategies();

  return NextResponse.json({ cards, articles, strategies });
}
