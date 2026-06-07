import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { createArticle } from "@/lib/actions/admin";
import Link from "next/link";

export default async function ArticleNewPage() {
  const db = getDb();
  const { rows: categories } = await db.query("SELECT * FROM article_categories ORDER BY sort_order");

  async function onSubmit(formData: FormData) {
    "use server";
    await createArticle({
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: formData.get("content") as string,
      categoryId: formData.get("categoryId") as string,
      isPublished: formData.get("isPublished") === "on",
    });
    redirect("/admin/articles");
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">記事作成</h2>
      <form action={onSubmit} className="max-w-2xl space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">タイトル</label>
          <input name="title" type="text" required
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">スラッグ（URL用）</label>
          <input name="slug" type="text" required
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">カテゴリ</label>
          <select name="categoryId" required
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none">
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">本文（Markdown対応）</label>
          <textarea name="content" required rows={12}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none font-mono leading-relaxed"
            placeholder="# 見出し&#10;&#10;本文をここに入力..." />
        </div>
        <div className="flex items-center gap-2">
          <input name="isPublished" type="checkbox" id="isPublished"
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
