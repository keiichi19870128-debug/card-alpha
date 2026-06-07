import Link from "next/link";

export function PremiumLock() {
  return (
    <div className="rounded-xl border border-accent/30 bg-accent/5 p-8 text-center">
      <div className="text-4xl mb-4">🔒</div>
      <h3 className="text-lg font-bold mb-2">プレミアム会員限定コンテンツ</h3>
      <p className="text-sm text-muted mb-6">
        この内容はプレミアム会員のみ閲覧できます。<br />
        月額380円で全てのコンテンツにアクセス可能です。
      </p>
      <Link
        href="/pricing"
        className="inline-flex items-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
      >
        プレミアム会員になる
      </Link>
    </div>
  );
}
