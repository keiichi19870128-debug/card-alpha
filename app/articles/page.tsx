import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedArticles, formatPrice } from "@/lib/db";
import { getAllCategories, getCategoryBySlug } from "@/lib/db";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "記事一覧",
  description: "ポケモンカードの投資戦略・高騰予想・最新情報をお届けします。初心者から上級者まで役立つ情報を掲載。",
  openGraph: {
    title: "記事一覧 | Card Alpha",
    description: "ポケモンカードの投資戦略・高騰予想・最新情報をお届けします。",
  },
};

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();
  const categories = await getAllCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">記事一覧</h1>
      <p className="mt-4 text-lg text-muted">
        ポケモンカードの投資戦略・高騰予想・最新情報をお届けします。
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/articles"
          className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
        >
          すべて
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/articles?category=${cat.slug}`}
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-primary/30 transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="group flex gap-4 rounded-xl border border-border bg-surface p-4 hover:border-primary/30 transition-colors sm:p-6"
          >
            <div className="hidden sm:flex h-24 w-32 shrink-0 items-center justify-center rounded-lg bg-surface-hover">
              <span className="text-3xl">📝</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {article.title}
              </h2>
              <p className="mt-2 text-sm text-muted line-clamp-2">
                {article.content.replace(/[#*`\n]/g, " ").slice(0, 120)}...
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs text-muted">
                <span>{article.published_at ? new Date(article.published_at).toLocaleDateString("ja-JP") : ""}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
