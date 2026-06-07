import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { createCard } from "@/lib/actions/admin";
import Link from "next/link";
import { Input, Select, Check } from "@/app/components/FormFields";

export default async function AdminCardNewPage() {
  const { rows: games } = await getDb().query("SELECT * FROM games ORDER BY name");

  async function onSubmit(formData: FormData) {
    "use server";
    await createCard({
      name: formData.get("name") as string,
      currentPrice: parseInt(formData.get("currentPrice") as string, 10),
      rating: formData.get("rating") as string,
      gameId: formData.get("gameId") as string,
      reason: (formData.get("reason") as string) || undefined,
      rarity: (formData.get("rarity") as string) || undefined,
      setName: (formData.get("setName") as string) || undefined,
      cardCode: (formData.get("cardCode") as string) || undefined,
      imageUrl: (formData.get("imageUrl") as string) || undefined,
      isFeatured: formData.get("isFeatured") === "on",
    });
    redirect("/admin/cards");
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">カード登録</h2>
      <form action={onSubmit} className="max-w-2xl space-y-5">
        <Input label="カード名" name="name" required />
        <Input label="現在価格" name="currentPrice" type="number" required />
        <Select label="評価" name="rating" options={["S","A","B"]} required />
        <Select label="ゲーム" name="gameId" options={games.map((g:any)=>({label:g.name,value:g.id}))} required />
        <Input label="レアリティ" name="rarity" />
        <Input label="拡張パック名" name="setName" />
        <Input label="カードコード" name="cardCode" />
        <Input label="画像URL" name="imageUrl" />
        <Input label="注目理由" name="reason" />
        <Check label="ホーム表示" name="isFeatured" />
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
            保存する
          </button>
          <Link href="/admin/cards" className="rounded-lg border border-border px-6 py-3 text-sm hover:bg-surface-hover transition-colors">
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}
