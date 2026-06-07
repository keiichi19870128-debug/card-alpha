import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { createArticle, updateArticle } from "@/lib/actions/admin";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ArticleEditPage({ params }: Props) {
  const p = await params;
  const id = p.id;

  const db = getDb();
  const { rows: categories } = await db.query("SELECT * FROM article_categories ORDER BY sort_order");
  const { rows: articleRows } = await db.query("SELECT * FROM articles WHERE id = $1", [id]);
  const article = articleRows[0];
  if (!article) redirect("/admin/articles");

  async function onSubmit(formData: FormData) {
    "use server";
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: formData.get("content") as string,
      categoryId: formData.get("categoryId") as string,
      isPublished: formData.get("isPublished") === "on",
    };
    await updateArticle(article.id, data);
    redirect("/admin/articles");
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">記事編集</h2>
      <form action={onSubmit} className="max-w-2xl space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">タイトル</label>
          <input name="title" type="text" defaultValue={article.title} required
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">スラッグ（URL用）</label>
          <input name="slug" type="text" defaultValue={article.slug} required
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">カテゴリ</label>
          <select name="categoryId" defaultValue={article.category_id} required
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none">
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">本文（Markdown対応）</label>
          <textarea name="content" defaultValue={article.content} required rows={12}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none font-mono leading-relaxed" />
        </div>
        <div className="flex items-center gap-2">
          <input name="isPublished" type="checkbox" id="isPublished" defaultChecked={article.is_published === 1}
            className="h-4 w-4 rounded border-border" />
          <label htmlFor="isPublished" className="text-sm">公開する</label>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
            保存する
          </button>
          <Link href="/admin/articles"
            className="rounded-lg border border-border px-6 py-3 text-sm hover:bg-surface-hover transition-colors">
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}
