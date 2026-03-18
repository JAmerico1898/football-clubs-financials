"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { categoryColors } from "@/lib/bar-chart-config";
import type { Season } from "@/lib/clubs";

export interface BarDatum {
  label: string;
  valCurrent: number;
  valPrior: number;
  category: string;
}

interface HorizontalBarChartProps {
  clubName: string;
  season: Season;
  data: BarDatum[] | null;
  error: string | null;
  loading: boolean;
  noPriorData: boolean;
}

function yearLabels(season: Season): { current: string; prior: string } {
  return season === "2025"
    ? { current: "2025", prior: "2024" }
    : { current: "2024", prior: "2023" };
}

function formatBRL(v: number): string {
  return `R$ ${v.toFixed(0)} mi`;
}

function CustomTooltip({ active, payload, label, years }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const sorted = [...payload].sort((a: any, b: any) => {
    if (a.dataKey === "valCurrent") return -1;
    if (b.dataKey === "valCurrent") return 1;
    return 0;
  });
  return (
    <div className="rounded shadow px-3 py-2 text-sm" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
      <p className="font-semibold mb-1">{label}</p>
      {sorted.map((entry: any) => (
        <p key={entry.dataKey} style={{ color: entry.dataKey === "valPrior" ? "var(--text-secondary)" : entry.color }}>
          {entry.name}: {formatBRL(Number(entry.value))}
        </p>
      ))}
    </div>
  );
}

export default function HorizontalBarChart({
  clubName,
  season,
  data,
  error,
  loading,
  noPriorData,
}: HorizontalBarChartProps) {
  const years = yearLabels(season);

  if (loading) return <p className="text-center py-8" style={{ color: "var(--text-secondary)" }}>Carregando gráfico de barras...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;
  if (!data) return null;

  return (
    <div>
      <div className="text-center mb-4">
        <p style={{ fontSize: 25, fontWeight: "bold" }}>{clubName}</p>
        <p style={{ fontSize: 20 }}>Comparativo {years.current} vs {years.prior}</p>
      </div>
      {noPriorData && (
        <p className="text-center text-amber-600 text-sm mb-2">
          Dados do ano anterior não disponíveis para este clube.
        </p>
      )}
      <div className="flex justify-center gap-6 mt-2 mb-2 text-sm">
        <div className="flex items-center gap-2">
          <span style={{ display: "inline-block", width: 14, height: 14, backgroundColor: "#333", borderRadius: 2 }} />
          <span>{years.current} (cor forte)</span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ display: "inline-block", width: 14, height: 14, backgroundColor: "#aaa", borderRadius: 2 }} />
          <span>{years.prior} (cor leve)</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={data.length * 52 + 57}>
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 40, bottom: 10, left: 220 }}>
          <XAxis
            type="number"
            tickFormatter={(v: number) => formatBRL(v)}
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={210}
            tick={{ fill: "var(--text-secondary)", fontSize: 14, fontWeight: 500 }}
          />
          <Tooltip content={<CustomTooltip years={years} />} />
          <ReferenceLine x={0} stroke="var(--text-secondary)" />
          <Bar dataKey="valCurrent" name={years.current} barSize={17}>
            {data.map((d, i) => (
              <Cell key={`cur-${i}`} fill={categoryColors[d.category].dark} />
            ))}
          </Bar>
          <Bar dataKey="valPrior" name={years.prior} barSize={17}>
            {data.map((d, i) => (
              <Cell key={`pri-${i}`} fill={categoryColors[d.category].light} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
