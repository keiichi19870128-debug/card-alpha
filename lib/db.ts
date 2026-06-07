import { Pool } from "pg";

let pool: Pool | null = null;

export function getDb(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    });
  }
  return pool;
}

export type CardRow = {
  id: string;
  name: string;
  image_url: string | null;
  current_price: number;
  rating: string;
  game_id: string;
  card_code: string | null;
  rarity: string | null;
  set_name: string | null;
  release_date: string | null;
  reason: string | null;
  is_featured: boolean;
  status: string;
  created_at: Date;
  updated_at: Date;
};

export type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category_id: string;
  featured_image: string | null;
  is_published: boolean;
  is_premium: boolean;
  published_at: Date | null;
  meta_title: string | null;
  meta_description: string | null;
  view_count: number;
  created_at: Date;
  updated_at: Date;
};

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
};

export type StrategyRow = {
  id: string;
  budget_amount: number;
  title: string;
  description: string;
  content: string | null;
  is_premium: boolean;
  game_id: string;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
};

export async function getFeaturedCards(limit = 4): Promise<CardRow[]> {
  const { rows } = await getDb().query(
    "SELECT * FROM cards WHERE is_featured = true AND status = 'active' ORDER BY created_at DESC LIMIT $1",
    [limit]
  );
  return rows;
}

export async function getAllCards(): Promise<CardRow[]> {
  const { rows } = await getDb().query("SELECT * FROM cards WHERE status = 'active' ORDER BY created_at DESC");
  return rows;
}

export async function getCardById(id: string): Promise<CardRow | undefined> {
  const { rows } = await getDb().query(
    "SELECT * FROM cards WHERE id = $1 AND status = 'active'",
    [id]
  );
  return rows[0];
}

export async function getCardsByRating(rating: string): Promise<CardRow[]> {
  const { rows } = await getDb().query(
    "SELECT * FROM cards WHERE rating = $1 AND status = 'active' ORDER BY created_at DESC",
    [rating]
  );
  return rows;
}

export async function getPublishedArticles(limit?: number): Promise<ArticleRow[]> {
  let sql = "SELECT * FROM articles WHERE is_published = true ORDER BY published_at DESC";
  if (limit) sql += ` LIMIT ${limit}`;
  const { rows } = await getDb().query(sql);
  return rows;
}

export async function getArticleBySlug(slug: string): Promise<ArticleRow | undefined> {
  const { rows } = await getDb().query(
    "SELECT * FROM articles WHERE slug = $1 AND is_published = true",
    [slug]
  );
  return rows[0];
}

export async function getArticlesByCategory(categoryId: string): Promise<ArticleRow[]> {
  const { rows } = await getDb().query(
    "SELECT * FROM articles WHERE category_id = $1 AND is_published = true ORDER BY published_at DESC",
    [categoryId]
  );
  return rows;
}

export async function getAllCategories(): Promise<CategoryRow[]> {
  const { rows } = await getDb().query("SELECT * FROM article_categories ORDER BY sort_order");
  return rows;
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRow | undefined> {
  const { rows } = await getDb().query("SELECT * FROM article_categories WHERE slug = $1", [slug]);
  return rows[0];
}

export async function getAllStrategies(): Promise<StrategyRow[]> {
  const { rows } = await getDb().query("SELECT * FROM budget_strategies ORDER BY sort_order");
  return rows;
}

export async function getStrategyByBudget(budget: number): Promise<StrategyRow | undefined> {
  const { rows } = await getDb().query(
    "SELECT * FROM budget_strategies WHERE budget_amount = $1",
    [budget]
  );
  return rows[0];
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(price);
}
