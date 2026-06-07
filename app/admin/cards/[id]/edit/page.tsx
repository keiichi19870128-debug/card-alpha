import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { updateCard } from "@/lib/actions/admin";
import Link from "next/link";
import { Input, Select, Check } from "@/app/components/FormFields";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminCardEditPage({ params }: Props) {
  const p = await params;
  const db = getDb();
  const { rows: cardRows } = await db.query("SELECT * FROM cards WHERE id = $1", [p.id]);
  const card = cardRows[0];
  if (!card) redirect("/admin/cards");
  const { rows: games } = await db.query("SELECT * FROM games ORDER BY name");

  async function onSubmit(formData: FormData) {
    "use server";
    await updateCard(p.id, {
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
      <h2 className="text-xl font-bold mb-6">カード編集</h2>
      <form action={onSubmit} className="max-w-2xl space-y-5">
        <Input label="カード名" name="name" defaultValue={card.name} required />
        <Input label="現在価格" name="currentPrice" type="number" defaultValue={card.current_price} required />
        <Select label="評価" name="rating" options={["S","A","B"]} defaultValue={card.rating} required />
        <Select label="ゲーム" name="gameId" options={games.map((g:any)=>({label:g.name,value:g.id}))} defaultValue={card.game_id} required />
        <Input label="レアリティ" name="rarity" defaultValue={card.rarity} />
        <Input label="拡張パック名" name="setName" defaultValue={card.set_name} />
        <Input label="カードコード" name="cardCode" defaultValue={card.card_code} />
        <Input label="画像URL" name="imageUrl" defaultValue={card.image_url} />
        <Input label="注目理由" name="reason" defaultValue={card.reason} />
        <Check label="ホーム表示" name="isFeatured" defaultChecked={card.is_featured === 1} />
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
