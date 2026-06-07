"use client";

export function PortalButton() {
  return (
    <button
      type="button"
      onClick={async () => {
        const res = await fetch("/api/stripe/portal", { method: "POST" });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      }}
      className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface-hover transition-colors"
    >
      プラン管理（解約・変更）
    </button>
  );
}

export function UpgradeButton() {
  return (
    <button
      type="button"
      onClick={async () => {
        const res = await fetch("/api/stripe/checkout", { method: "POST" });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      }}
      className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
    >
      プレミアムにアップグレード
    </button>
  );
}

export function WatchlistButton({ cardId, isWatched }: { cardId: string; isWatched: boolean }) {
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cardId }),
        });
        window.location.reload();
      }}
      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
        isWatched
          ? "border-primary bg-primary/10 text-primary"
          : "border-border hover:border-primary/30"
      }`}
    >
      {isWatched ? "★ ウォッチ中" : "☆ ウォッチリストに追加"}
    </button>
  );
}

export function AlertButton({ cardId }: { cardId: string }) {
  return (
    <button
      type="button"
      onClick={async () => {
        const targetPrice = prompt("目標価格を入力してください（円）:");
        if (!targetPrice) return;
        const condition = confirm("「以上」で通知しますか？\nOK = 以上 / キャンセル = 以下") ? "above" : "below";

        const res = await fetch("/api/alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cardId, targetPrice: parseInt(targetPrice, 10), condition }),
        });
        const data = await res.json();
        if (data.success) {
          alert("アラートを設定しました！");
        } else {
          alert(data.error || "設定に失敗しました");
        }
      }}
      className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-accent/30 hover:text-accent transition-colors"
    >
      🔔 価格アラート設定
    </button>
  );
}
