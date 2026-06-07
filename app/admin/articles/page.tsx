import Link from "next/link";
import { getDb } from "@/lib/db";
import { deleteArticle } from "@/lib/actions/admin";

export default async function AdminArticlesPage() {
  const { rows: articles } = await getDb().query(
    "SELECT articles.*, article_categories.name as category_name FROM articles LEFT JOIN article_categories ON articles.category_id = article_categories.id ORDER BY articles.created_at DESC"
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">記事管理</h2>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
        >
          + 新規作成
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="pb-3 pr-4">状態</th>
              <th className="pb-3 pr-4">タイトル</th>
              <th className="pb-3 pr-4">カテゴリ</th>
              <th className="pb-3 pr-4">更新日</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a: any) => (
              <tr key={a.id} className="border-b border-border/50 hover:bg-surface-hover transition-colors">
                <td className="py-3 pr-4">
                  <span className={`rounded px-1.5 py-0.5 text-xs ${
                    a.is_published ? "bg-green-500/20 text-green-400" : "bg-muted/20 text-muted"
                  }`}>
                    {a.is_published ? "公開中" : "下書き"}
                  </span>
                </td>
                <td className="py-3 pr-4 font-medium max-w-[200px] truncate">{a.title}</td>
                <td className="py-3 pr-4 text-muted">{a.category_name}</td>
                <td className="py-3 pr-4 text-muted text-xs">
                  {new Date(a.updated_at).toLocaleDateString("ja-JP")}
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/articles/${a.id}/edit`}
                      className="rounded px-2 py-1 text-xs font-medium border border-border hover:bg-surface-hover transition-colors"
                    >
                      編集
                    </Link>
                    <form action={async () => {
                      "use server";
                      await deleteArticle(a.id);
                    }}>
                      <button
                        type="submit"
                        className="rounded px-2 py-1 text-xs font-medium border border-danger/30 text-danger hover:bg-danger/10 transition-colors"
                      >
                        削除
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
