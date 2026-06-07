import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getPublishedArticles } from "@/lib/db";
import { checkPremiumAccess } from "@/lib/premium";
import { PremiumLock } from "@/app/components/PremiumLock";
import { AdBanner } from "@/app/components/AdBanner";
import React from "react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const article = await getArticleBySlug(p.slug);
  if (!article) return { title: "Not Found | Card Alpha" };
  const title = article.title;
  const description = article.meta_description || article.content.replace(/[#*`\n]/g, " ").slice(0, 120);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.published_at?.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function renderMarkdown(content: string): React.ReactNode[] {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) {
      elements.push(<h3 key={key++} className="mt-6 text-lg font-bold">{trimmed.slice(4)}</h3>);
    } else if (trimmed.startsWith("## ")) {
      elements.push(<h2 key={key++} className="mt-8 text-xl font-extrabold">{trimmed.slice(3)}</h2>);
    } else if (trimmed.startsWith("# ")) {
      elements.push(<h1 key={key++} className="mt-8 text-2xl font-extrabold">{trimmed.slice(2)}</h1>);
    } else if (trimmed.startsWith("- ")) {
      elements.push(<li key={key++} className="list-disc ml-5">{trimmed.slice(2)}</li>);
    } else if (trimmed === "") {
      elements.push(<div key={key++} className="h-2" />);
    } else {
      elements.push(<p key={key++} className="leading-relaxed">{trimmed}</p>);
    }
  }
  return elements;
}

export default async function ArticleDetailPage({ params }: Props) {
  const p = await params;
  const article = await getArticleBySlug(p.slug);
  if (!article) notFound();

  const { isPremium } = await checkPremiumAccess();
  const isLocked = article.is_premium && !isPremium;

  const related = (await getPublishedArticles(3))
    .filter((a) => a.id !== article.id)
    .slice(0, 2);

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/articles" className="text-sm text-muted hover:text-foreground transition-colors">
        ← 記事一覧
      </Link>

      <header className="mt-6">
        <div className="flex items-center gap-2 text-sm text-muted">
          <span>
            {article.published_at
              ? new Date(article.published_at).toLocaleDateString("ja-JP")
              : ""}
          </span>
          {article.is_premium && (
            <span className="rounded-full bg-accent/20 text-accent px-2 py-0.5 text-xs font-bold">
              PREMIUM
            </span>
          )}
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {article.title}
        </h1>
      </header>

      <div className="mt-8">
        {isLocked ? (
          <>
            <div className="prose prose-invert max-w-none text-sm leading-relaxed line-clamp-6 opacity-60">
              {renderMarkdown(article.content.slice(0, 300))}
            </div>
            <div className="mt-6">
              <PremiumLock />
            </div>
          </>
        ) : (
          <div className="prose prose-invert max-w-none text-sm leading-relaxed">
            {renderMarkdown(article.content)}
          </div>
        )}
      </div>

      {related.length > 0 && (
        <div className="mt-16 border-t border-border pt-10">
          <AdBanner placement="inline" />
          <h2 className="text-lg font-bold mb-4">関連記事</h2>
          <div className="flex flex-col gap-4">
            {related.map((a) => (
              <Link
                key={a.id}
                href={`/articles/${a.slug}`}
                className="block rounded-lg border border-border bg-surface p-4 hover:border-primary/30 transition-colors"
              >
                <div className="font-semibold text-sm">{a.title}</div>
                <div className="mt-1 text-xs text-muted">
                  {a.published_at ? new Date(a.published_at).toLocaleDateString("ja-JP") : ""}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
