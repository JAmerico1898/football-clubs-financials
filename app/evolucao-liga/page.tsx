"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Papa from "papaparse";
import ModuleNavbar from "@/components/ModuleNavbar";
import CategorySelector from "@/components/CategorySelector";
import LeagueEvolutionChart from "@/components/LeagueEvolutionChart";
import {
  ALL_METRICS,
  DEFAULT_METRICS,
  METRIC_COLORS,
  MAX_SELECTED,
  MIN_SELECTED,
} from "@/lib/evolucao-liga-constants";

type WideRow = { year: number; [metric: string]: number };

function parseEvolucaoLigaCSV(raw: string): WideRow[] {
  const csvText = raw.replace(/^\uFEFF/, "");
  const parsed = Papa.parse<string[]>(csvText, { header: false });
  const rows = parsed.data as string[][];

  // Row 0 is the header: "Total da Liga", 2021, 2022, 2023, 2024, 2025
  const headerRow = rows[0];
  const years = headerRow.slice(1).map((y) => Math.round(parseFloat(y)));

  // Build wide-format: one object per year
  const wide: WideRow[] = years.map((year) => ({ year }) as WideRow);

  // Data rows start at index 1
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const metric = row[0]?.trim();
    if (!metric) continue;
    if (metric === "Pontuação Série A") continue;

    for (let i = 0; i < years.length; i++) {
      const val = parseFloat(row[i + 1]);
      wide[i][metric] = isNaN(val) ? 0 : val;
    }
  }

  return wide;
}

export default function EvolucaoLiga() {
  const [data, setData] = useState<WideRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activated, setActivated] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    fetch("/data/evolucao_liga.csv")
      .then((res) => {
        if (!res.ok) throw new Error("Não foi possível carregar os dados");
        return res.text();
      })
      .then((raw) => setData(parseEvolucaoLigaCSV(raw)))
      .catch((err) => setError(err.message));
  }, []);

  const visibleMetrics = activated ? selected : DEFAULT_METRICS;

  return (
    <>
      {/* Fixed grass background + light green overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="/grass-bg.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 light-page-bg-overlay" />
      </div>

      <main className="relative z-10 max-w-[1200px] mx-auto px-4 py-8">
        <ModuleNavbar />

        <h1
          className="text-3xl font-bold tracking-tight text-center mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Evolução Financeira da Liga
        </h1>

        <p
          className="text-sm text-center mb-2 max-w-2xl mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Evolução dos principais agregados financeiros da liga entre 2021 e
          2025. Os valores representam a soma das métricas de todos os clubes
          participantes do Brasileirão em cada temporada, expressos em R$
          milhões.
        </p>
        <p className="text-center mb-8 text-sm">
          <Link
            href="/glossario"
            className="font-semibold hover:underline"
            style={{ color: "var(--brand-blue)" }}
          >
            Ver Glossário
          </Link>
        </p>

        {error && (
          <p
            className="text-center py-8"
            style={{ color: "var(--brand-red)" }}
          >
            {error}
          </p>
        )}

        {!data && !error && (
          <p
            className="text-center py-8"
            style={{ color: "var(--text-secondary)" }}
          >
            Carregando...
          </p>
        )}

        {data && (
          <div className="space-y-8">
            {/* Metric selector */}
            <div className="card-surface p-6">
              <CategorySelector
                selected={selected}
                setSelected={setSelected}
                activated={activated}
                setActivated={setActivated}
                allCategories={ALL_METRICS}
                categoryColors={METRIC_COLORS}
                maxSelected={MAX_SELECTED}
                minSelected={MIN_SELECTED}
                defaultDescription="Receita da Atividade Esportiva e Custo da Atividade Esportiva são exibidas por padrão."
              />
            </div>

            {/* Line chart */}
            <div className="card-surface p-6">
              <LeagueEvolutionChart
                data={data}
                selectedMetrics={visibleMetrics}
              />
            </div>
          </div>
        )}
        <ModuleNavbar />
      </main>
    </>
  );
}
