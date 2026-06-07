import type { AnalysisScore } from "@/lib/analysis";

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted w-16 shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-surface-hover overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-bold w-8 text-right">{value}</span>
    </div>
  );
}

export function AnalysisScoreCard({ score }: { score: AnalysisScore }) {
  const overallColor = score.overall >= 80 ? "text-yellow-400" :
    score.overall >= 60 ? "text-green-400" : "text-blue-400";

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">AI分析スコア</h3>
        <div className={`text-2xl font-extrabold ${overallColor}`}>
          {score.overall}
          <span className="text-xs font-normal text-muted ml-1">/ 100</span>
        </div>
      </div>
      <div className="space-y-3">
        <ScoreBar label="人気度" value={score.popularity} color="bg-pink-500" />
        <ScoreBar label="希少性" value={score.rarity} color="bg-purple-500" />
        <ScoreBar label="将来性" value={score.potential} color="bg-cyan-500" />
      </div>
    </div>
  );
}
