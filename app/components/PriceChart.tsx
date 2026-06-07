"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type PricePoint = {
  date: string;
  price: number;
};

export function PriceChart({ data }: { data: PricePoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 rounded-xl border border-border bg-surface text-sm text-muted">
        価格履歴がまだありません
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            tickFormatter={(v) => `¥${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#13131a",
              border: "1px solid #2a2a3a",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#6b7280" }}
            formatter={(value) => [`¥${Number(value).toLocaleString()}`, "価格"]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ fill: "#22c55e", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
