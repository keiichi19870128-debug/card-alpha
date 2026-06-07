"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type AdPlacement = "sidebar" | "inline" | "banner";

const adContent: Record<AdPlacement, { title: string; desc: string; link: string }> = {
  banner: {
    title: "カードショップ「まとめ買い」なら送料無料！",
    desc: "人気カードを最安値でゲット。初回10%OFFクーポン配布中",
    link: "#",
  },
  sidebar: {
    title: "PSA鑑定サービス",
    desc: "あなたのカードを最高グレードに。国内最安の鑑定代行",
    link: "#",
  },
  inline: {
    title: "防湿庫で大切なカードを守ろう",
    desc: "カード保管に最適な防湿庫が今なら20%OFF",
    link: "#",
  },
};

export function AdBanner({ placement = "banner" }: { placement?: AdPlacement }) {
  const { data: session } = useSession();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/me")
        .then(r => r.json())
        .then(data => { if (data.isPremium) setIsPremium(true); })
        .catch(() => {});
    }
  }, [session]);

  // Premium users: no ads
  if (isPremium) return null;

  const ad = adContent[placement];

  if (placement === "banner") {
    return (
      <div className="w-full border-y border-border/50 bg-surface-hover/50 py-3">
        <div className="mx-auto max-w-6xl px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="shrink-0 rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] font-bold text-yellow-400">AD</span>
            <a href={ad.link} className="text-sm hover:text-primary transition-colors">
              <span className="font-medium">{ad.title}</span>
              <span className="hidden sm:inline text-muted ml-2">{ad.desc}</span>
            </a>
          </div>
          <span className="text-[10px] text-muted shrink-0">広告</span>
        </div>
      </div>
    );
  }

  if (placement === "sidebar") {
    return (
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] font-bold text-yellow-400">AD</span>
          <span className="text-[10px] text-muted">広告</span>
        </div>
        <a href={ad.link} className="block hover:text-primary transition-colors">
          <div className="text-sm font-medium">{ad.title}</div>
          <div className="mt-1 text-xs text-muted">{ad.desc}</div>
        </a>
      </div>
    );
  }

  // inline
  return (
    <div className="my-8 rounded-xl border border-border/50 bg-surface-hover/30 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] font-bold text-yellow-400">AD</span>
        <span className="text-[10px] text-muted">広告</span>
      </div>
      <a href={ad.link} className="block hover:text-primary transition-colors">
        <div className="text-sm font-medium">{ad.title}</div>
        <div className="mt-1 text-xs text-muted">{ad.desc}</div>
      </a>
    </div>
  );
}
