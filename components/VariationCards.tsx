"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import type { Club, Season } from "@/lib/clubs";

interface MetricDef {
  label: string;
  dadosKey: string;
  higherIsBetter: boolean;
}

interface Props {
  club: Club;
  season: Season;
  metrics?: MetricDef[];
}

const DEFAULT_METRICS: MetricDef[] = [
  { label: "Receita Operacional", dadosKey: "Receita Operacional", higherIsBetter: true },
  { label: "Receita da Atividade Esportiva", dadosKey: "Receita da Atividade Esportiva", higherIsBetter: true },
  { label: "Custo da Atividade Esportiva", dadosKey: "Custo da Atividade Esportiva", higherIsBetter: true },
  { label: "Geração de Caixa Operacional", dadosKey: "Geração de Caixa Operacional", higherIsBetter: true },
  { label: "Dívida Líquida", dadosKey: "Dívida Líquida", higherIsBetter: false },
  { label: "Resultado", dadosKey: "Resultado", higherIsBetter: true },
];

export const BREAKDOWN_METRICS: MetricDef[] = [
  { label: "Receita c/ Transmissão + Premiações", dadosKey: "Receita c/ Transmissão + Premiações", higherIsBetter: true },
  { label: "Receita Comercial", dadosKey: "Receita Comercial", higherIsBetter: true },
  { label: "Receita c/ Match-Day + Sócio-Torcedor", dadosKey: "Receita c/ Match-Day + Sócio-Torcedor", higherIsBetter: true },
  { label: "Receita c/ Negociação de atletas", dadosKey: "Receita c/ Negociação de atletas", higherIsBetter: true },
  { label: "Folha do Futebol", dadosKey: "Folha do Futebol", higherIsBetter: true },
  { label: "Aquisições de Atletas", dadosKey: "Aquisições de atletas", higherIsBetter: true },
];

interface Row {
  ano: string;
  dados: string;
  value: number;
}

function formatValue(val: number): string {
  const abs = Math.abs(val);
  const sign = val < 0 ? "-" : "";
  if (abs >= 1_000) return `${sign}R$ ${(abs / 1_000).toFixed(2).replace(".", ",")} Bi`;
  return `${sign}R$ ${abs.toFixed(1).replace(".", ",")} M`;
}

function formatPct(pct: number): string {
  if (!isFinite(pct)) return "—";
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1).replace(".", ",")}%`;
}

export default function VariationCards({ club, season, metrics = DEFAULT_METRICS }: Props) {
  const currentYear = season;
  const priorYear = season === "2025" ? "2024" : "2023";
  const [rows, setRows] = useState<Row[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setRows(null);
    fetch("/data/Painel_Consolidado_Moeda_Cte.csv")
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar painel consolidado");
        return res.text();
      })
      .then((csvText) => {
        const parsed = Papa.parse(csvText, { header: false, skipEmptyLines: true });
        const data = parsed.data as string[][];
        const header = data[0].map((h) => h.replace(/^﻿/, ""));
        const anoIdx = header.indexOf("Ano");
        const dadosIdx = header.indexOf("Dados");
        const colIdx = header.indexOf(club.csvColumn);
        if (colIdx === -1) {
          throw new Error(`Coluna "${club.csvColumn}" não encontrada`);
        }
        const out: Row[] = [];
        for (let i = 1; i < data.length; i++) {
          const r = data[i];
          if (!r[anoIdx]) continue;
          const raw = r[colIdx];
          const value = raw === undefined || raw === "" ? NaN : parseFloat(raw);
          out.push({ ano: r[anoIdx], dados: r[dadosIdx], value });
        }
        setRows(out);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [club]);

  if (loading) {
    return (
      <div className="card-surface flex items-center justify-center min-h-[100px] mb-6">
        <p style={{ color: "var(--text-secondary)" }}>Carregando variações...</p>
      </div>
    );
  }

  if (error || !rows) {
    return null;
  }

  function getValue(ano: string, key: string): number {
    const row = rows!.find((r) => r.ano === ano && r.dados === key);
    return row && isFinite(row.value) ? row.value : NaN;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {metrics.map((m) => {
        const vCurrent = getValue(currentYear, m.dadosKey);
        const vPrior = getValue(priorYear, m.dadosKey);
        const hasPrior = isFinite(vPrior) && vPrior !== 0;
        const pct = hasPrior ? ((vCurrent - vPrior) / Math.abs(vPrior)) * 100 : NaN;
        const rawUp = isFinite(pct) ? pct >= 0 : true;
        const positive = m.higherIsBetter ? rawUp : !rawUp;
        const color = positive ? "#2E7D32" : "#C62828";
        const bg = positive ? "rgba(46,125,50,0.1)" : "rgba(198,40,40,0.1)";
        const arrow = rawUp ? "↗" : "↘";

        return (
          <div key={m.dadosKey} className="card-surface flex flex-col justify-between gap-2 p-4">
            <p
              className="text-[11px] uppercase tracking-wider font-semibold leading-tight"
              style={{ color: "var(--text-secondary)" }}
            >
              {m.label}
            </p>
            <p
              className="text-xl font-extrabold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {isFinite(vCurrent) ? formatValue(vCurrent) : "—"}
            </p>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold self-start"
              style={{ backgroundColor: bg, color }}
            >
              <span>{arrow}</span> {formatPct(pct)} vs {priorYear}
            </span>
          </div>
        );
      })}
    </div>
  );
}
