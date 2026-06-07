import Link from "next/link";
import { getDb } from "@/lib/db";
import { updateStrategy, getAdminStrategies } from "@/lib/actions/admin";

export default async function AdminStrategiesPage() {
  const strategies = await getAdminStrategies();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">戦略管理</h2>
      </div>

      <div className="flex flex-col gap-6">
        {strategies.map((s: any) => (
          <StrategyEditForm key={s.id} strategy={s} />
        ))}
      </div>
    </div>
  );
}

function StrategyEditForm({ strategy }: { strategy: any }) {
  async function onSubmit(formData: FormData) {
    "use server";
    await updateStrategy(strategy.id, {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      content: formData.get("content") as string,
      isPremium: formData.get("isPremium") === "on",
    });
  }

  return (
    <form action={onSubmit} className="rounded-xl border border-border bg-surface p-6">
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl font-extrabold text-primary">{strategy.budget_amount.toLocaleString()}円</span>
        <span className="text-sm text-muted">{strategy.title}</span>
      </div>
      <div className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-1.5">タイトル</label>
          <input name="title" defaultValue={strategy.title} required
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">概要</label>
          <textarea name="description" defaultValue={strategy.description} required rows={2}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">詳細内容（Markdown）</label>
          <textarea name="content" defaultValue={strategy.content || ""} rows={4}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none font-mono" />
        </div>
        <div className="flex items-center gap-2">
          <input name="isPremium" type="checkbox" id={`isPremium-${strategy.id}`} defaultChecked={strategy.is_premium}
            className="h-4 w-4 rounded border-border" />
          <label htmlFor={`isPremium-${strategy.id}`} className="text-sm">有料会員限定</label>
        </div>
        <div className="pt-2">
          <button type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
            保存する
          </button>
        </div>
      </div>
    </form>
  );
}
