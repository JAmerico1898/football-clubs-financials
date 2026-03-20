"use client";

import type { BarDatum } from "@/hooks/useModulo1Data";
import type { Season } from "@/lib/clubs";

interface Props {
  barData: BarDatum[] | null;
  loading: boolean;
  season: Season;
}

function formatValue(val: number): string {
  const abs = Math.abs(val);
  if (abs >= 1_000) return `R$ ${(val / 1_000).toFixed(1).replace(".", ",")} Bi`;
  return `R$ ${Math.round(val)} M`;
}

function formatPct(pct: number): string {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1).replace(".", ",")}%`;
}

function priorSeasonLabel(season: Season): string {
  return season === "2025" ? "vs 2024" : "vs 2023";
}

export default function MetricHighlights({ barData, loading, season }: Props) {
  if (loading) {
    return (
      <div className="card-surface flex items-center justify-center min-h-[200px]">
        <p style={{ color: "var(--text-secondary)" }}>Carregando destaques...</p>
      </div>
    );
  }

  if (!barData) return null;

  // Compute % changes, filtering out metrics with zero prior value
  const changes = barData
    .filter((d) => d.valPrior !== 0)
    .map((d) => ({
      label: d.label,
      valCurrent: d.valCurrent,
      pct: ((d.valCurrent - d.valPrior) / Math.abs(d.valPrior)) * 100,
    }));

  if (changes.length === 0) return null;

  const best = changes.reduce((a, b) => (b.pct > a.pct ? b : a));
  const worst = changes.reduce((a, b) => (b.pct < a.pct ? b : a));

  const vsLabel = priorSeasonLabel(season);

  return (
    <div className="card-surface flex flex-col justify-center gap-6 h-full">
      <h3 className="text-sm font-bold uppercase tracking-widest text-center" style={{ color: "var(--text-secondary)" }}>
        Maiores Variações
      </h3>

      {/* Best metric */}
      <div>
        <p className="text-xs uppercase tracking-widest mb-1 font-semibold" style={{ color: "var(--text-secondary)" }}>
          {best.label}
        </p>
        <p className="text-4xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
          {formatValue(best.valCurrent)}
        </p>
        <span
          className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-sm font-semibold"
          style={{ backgroundColor: "rgba(46,125,50,0.1)", color: "#2E7D32" }}
        >
          <span>&#x2197;</span> {formatPct(best.pct)} {vsLabel}
        </span>
      </div>

      <hr style={{ borderColor: "var(--border)" }} />

      {/* Worst metric */}
      <div>
        <p className="text-xs uppercase tracking-widest mb-1 font-semibold" style={{ color: "var(--text-secondary)" }}>
          {worst.label}
        </p>
        <p className="text-4xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
          {formatValue(worst.valCurrent)}
        </p>
        <span
          className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-sm font-semibold"
          style={{ backgroundColor: "rgba(198,40,40,0.1)", color: "#C62828" }}
        >
          <span>&#x2198;</span> {formatPct(worst.pct)} {vsLabel}
        </span>
      </div>
    </div>
  );
}
