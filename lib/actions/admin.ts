"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";

type AdminActionResult = {
  success: boolean;
  error?: string;
  id?: string;
};

// ========== Articles ==========

export async function createArticle(data: {
  title: string;
  slug: string;
  content: string;
  categoryId: string;
  isPublished: boolean;
}): Promise<AdminActionResult> {
  try {
    const db = getDb();
    const existing = (await db.query("SELECT id FROM articles WHERE slug = $1", [data.slug])).rows[0];
    if (existing) return { success: false, error: "Slug already exists" };

    const id = crypto.randomUUID();
    await db.query(
      "INSERT INTO articles (id, title, slug, content, category_id, is_published, published_at, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [id, data.title, data.slug, data.content, data.categoryId, data.isPublished, data.isPublished ? new Date() : null, new Date(), new Date()]
    );
    revalidatePath("/articles");
    return { success: true, id };
  } catch (e: any) {
    return { success: false, error: e.message ?? "Failed to create article" };
  }
}

export async function updateArticle(
  id: string,
  data: {
    title: string;
    slug: string;
    content: string;
    categoryId: string;
    isPublished: boolean;
  }
): Promise<AdminActionResult> {
  try {
    const db = getDb();
    const existing = (await db.query("SELECT id FROM articles WHERE slug = $1 AND id != $2", [data.slug, id])).rows[0];
    if (existing) return { success: false, error: "Slug already exists" };

    await db.query(
      "UPDATE articles SET title = $1, slug = $2, content = $3, category_id = $4, is_published = $5, updated_at = $6 WHERE id = $7",
      [data.title, data.slug, data.content, data.categoryId, data.isPublished, new Date(), id]
    );
    revalidatePath("/articles");
    revalidatePath(`/articles/${data.slug}`);
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message ?? "Failed to update article" };
  }
}

export async function deleteArticle(id: string): Promise<AdminActionResult> {
  try {
    await getDb().query("DELETE FROM articles WHERE id = $1", [id]);
    revalidatePath("/articles");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message ?? "Failed to delete article" };
  }
}

// ========== Cards ==========

export async function createCard(data: {
  name: string;
  currentPrice: number;
  rating: string;
  gameId: string;
  reason?: string;
  rarity?: string;
  setName?: string;
  cardCode?: string;
  imageUrl?: string;
  isFeatured?: boolean;
}): Promise<AdminActionResult> {
  try {
    const id = crypto.randomUUID();
    await getDb().query(
      "INSERT INTO cards (id, name, current_price, rating, game_id, reason, rarity, set_name, card_code, image_url, is_featured, status, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)",
      [id, data.name, data.currentPrice, data.rating, data.gameId, data.reason ?? null, data.rarity ?? null, data.setName ?? null, data.cardCode ?? null, data.imageUrl ?? null, data.isFeatured ?? false, "active", new Date(), new Date()]
    );
    revalidatePath("/cards");
    return { success: true, id };
  } catch (e: any) {
    return { success: false, error: e.message ?? "Failed to create card" };
  }
}

export async function updateCard(
  id: string,
  data: {
    name: string;
    currentPrice: number;
    rating: string;
    gameId: string;
    reason?: string;
    rarity?: string;
    setName?: string;
    cardCode?: string;
    imageUrl?: string;
    isFeatured?: boolean;
  }
): Promise<AdminActionResult> {
  try {
    await getDb().query(
      "UPDATE cards SET name = $1, current_price = $2, rating = $3, game_id = $4, reason = $5, rarity = $6, set_name = $7, card_code = $8, image_url = $9, is_featured = $10, updated_at = $11 WHERE id = $12",
      [data.name, data.currentPrice, data.rating, data.gameId, data.reason ?? null, data.rarity ?? null, data.setName ?? null, data.cardCode ?? null, data.imageUrl ?? null, data.isFeatured ?? false, new Date(), id]
    );
    revalidatePath("/cards");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message ?? "Failed to update card" };
  }
}

export async function deleteCard(id: string): Promise<AdminActionResult> {
  try {
    await getDb().query("DELETE FROM cards WHERE id = $1", [id]);
    revalidatePath("/cards");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message ?? "Failed to delete card" };
  }
}

// ========== Strategies ==========

export async function updateStrategy(
  id: string,
  data: {
    title: string;
    description: string;
    content?: string;
    isPremium?: boolean;
  }
): Promise<AdminActionResult> {
  try {
    await getDb().query(
      "UPDATE budget_strategies SET title = $1, description = $2, content = $3, is_premium = $4, updated_at = $5 WHERE id = $6",
      [data.title, data.description, data.content ?? null, data.isPremium ?? false, new Date(), id]
    );
    revalidatePath("/strategies");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message ?? "Failed to update strategy" };
  }
}

// ========== Price History ==========

export async function recordPrice(data: {
  cardId: string;
  price: number;
  source?: string;
}): Promise<AdminActionResult> {
  try {
    const db = getDb();
    const recordedAt = new Date();
    // Use date only (no time) for unique constraint
    const dateOnly = new Date(recordedAt.getFullYear(), recordedAt.getMonth(), recordedAt.getDate());
    await db.query(
      `INSERT INTO price_histories (id, card_id, price, recorded_at, source, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (card_id, recorded_at) DO UPDATE SET price = $3, source = $5`,
      [crypto.randomUUID(), data.cardId, data.price, dateOnly, data.source ?? null]
    );
    // Also update current_price on the card
    await db.query("UPDATE cards SET current_price = $1, updated_at = NOW() WHERE id = $2", [data.price, data.cardId]);
    revalidatePath("/admin/prices");
    revalidatePath("/cards");
    revalidatePath("/rankings");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message ?? "Failed to record price" };
  }
}

// ========== Common lookups ==========

export async function getAdminArticles() {
  return (await getDb().query("SELECT * FROM articles ORDER BY created_at DESC")).rows;
}

export async function getAdminCards() {
  return (await getDb().query("SELECT * FROM cards ORDER BY created_at DESC")).rows;
}

export async function getAdminStrategies() {
  return (await getDb().query("SELECT * FROM budget_strategies ORDER BY budget_amount")).rows;
}

export async function getAdminCategories() {
  return (await getDb().query("SELECT * FROM article_categories ORDER BY sort_order")).rows;
}
