"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import BackButton from "@/components/BackButton";
import InequalityLineChart, { LineConfig } from "@/components/InequalityLineChart";

type MetricKey = "gini" | "maxMin" | "c3" | "c5";

interface MetricData {
  turnover: Record<string, string | number | null>[];
  broadcast: Record<string, string | number | null>[];
}

const METRIC_LABELS: Record<MetricKey, string> = {
  gini: "Gini Index",
  maxMin: "Max/Min Ratio",
  c3: "C3 Ratio",
  c5: "C5 Ratio",
};

const TURNOVER_LINES: LineConfig[] = [
  { dataKey: "brasileirao", label: "Brasileirão", color: "#2E7D32", countryCode: "br" },
  { dataKey: "epl_turnover", label: "Premier League", color: "#D32F2F", countryCode: "gb" },
];

const BROADCAST_LINES: LineConfig[] = [
  { dataKey: "epl_broadcast", label: "Premier League", color: "#D32F2F", countryCode: "gb" },
  { dataKey: "laliga", label: "La Liga", color: "#FF8F00", countryCode: "es" },
  { dataKey: "bundesliga", label: "Bundesliga", color: "#212121", countryCode: "de" },
  { dataKey: "seriea", label: "Serie A", color: "#1565C0", countryCode: "it" },
];

const TURNOVER_FOOTNOTE = "A comparação usa 2021 para o Brasil e 2020/21 para a Europa.\nReceita Total não disponível para as demais ligas europeias.";
const BROADCAST_FOOTNOTE = "Receita de Transmissão não disponível para a liga brasileira.";

interface SectionConfig {
  key: MetricKey;
  heading: string;
  explanation: string;
  yAxisLabel: string;
  turnoverTitle: string;
  broadcastTitle: string;
  formatDecimals: number;
  yDomain?: [number, number];
}

const SECTIONS: SectionConfig[] = [
  {
    key: "gini",
    heading: "Índice de Gini",
    explanation:
      "O Índice de Gini mede a desigualdade na distribuição de receitas entre os clubes de uma liga. O valor varia de 0 (igualdade perfeita) a 1 (desigualdade máxima). Quanto maior o índice, mais concentrada é a riqueza na liga.",
    yAxisLabel: "Índice de Gini",
    turnoverTitle: "Índice de Gini — Receita Total",
    broadcastTitle: "Índice de Gini — Receita de TV",
    formatDecimals: 4,
  },
  {
    key: "maxMin",
    heading: "Razão Máx/Mín",
    explanation:
      "O Índice Max-Min compara a receita do clube mais rico com a do clube mais pobre da liga. Quanto maior o valor, maior a disparidade entre o topo e a base da competição.",
    yAxisLabel: "Razão Máx/Mín",
    turnoverTitle: "Razão Máx/Mín — Receita Total",
    broadcastTitle: "Razão Máx/Mín — Receita de TV",
    formatDecimals: 2,
  },
  {
    key: "c3",
    heading: "Razão C3",
    explanation:
      "A Razão C3 divide a soma da receita dos três clubes de maior arrecadação pela receita total da competição. Quanto maior o valor, mais concentrada é a receita nos três maiores clubes.",
    yAxisLabel: "Razão C3",
    turnoverTitle: "Razão C3 — Receita Total",
    broadcastTitle: "Razão C3 — Receita de TV",
    formatDecimals: 4,
    yDomain: [0, 1],
  },
  {
    key: "c5",
    heading: "Razão C5",
    explanation:
      "A Razão C5 divide a soma da receita dos cinco clubes de maior arrecadação pela receita total da competição. Quanto maior o valor, mais concentrada é a receita nos cinco maiores clubes.",
    yAxisLabel: "Razão C5",
    turnoverTitle: "Razão C5 — Receita Total",
    broadcastTitle: "Razão C5 — Receita de TV",
    formatDecimals: 4,
    yDomain: [0, 1],
  },
];

function parseAllMetrics(rows: string[][]): Record<MetricKey, MetricData> {
  const result = {} as Record<MetricKey, MetricData>;

  for (const [key, label] of Object.entries(METRIC_LABELS) as [MetricKey, string][]) {
    const labelIdx = rows.findIndex((r) => r[0]?.trim() === label);
    if (labelIdx < 0) throw new Error(`Label "${label}" não encontrado no CSV`);

    // Skip label row and header row, read 5 data rows
    const dataRows = rows.slice(labelIdx + 2, labelIdx + 7);

    const turnover: Record<string, string | number | null>[] = [];
    const broadcast: Record<string, string | number | null>[] = [];

    for (const row of dataRows) {
      const seasonRaw = row[0]?.trim();
      if (!seasonRaw) continue;
      // Extract end year: "2020/21" → "2021"
      const season = seasonRaw.includes("/")
        ? "20" + seasonRaw.split("/")[1]
        : seasonRaw;

      const parseVal = (col: number): number | null => {
        const raw = row[col];
        if (raw == null || raw.trim() === "") return null;
        const val = parseFloat(raw);
        return isNaN(val) ? null : val;
      };

      turnover.push({
        season,
        brasileirao: parseVal(1),
        epl_turnover: parseVal(2),
      });

      broadcast.push({
        season,
        epl_broadcast: parseVal(3),
        laliga: parseVal(4),
        bundesliga: parseVal(5),
        seriea: parseVal(6),
      });
    }

    result[key] = { turnover, broadcast };
  }

  return result;
}

export default function AnaliseDeDesigualdade() {
  const [metrics, setMetrics] = useState<Record<MetricKey, MetricData> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/Gini_Index.csv")
      .then((res) => {
        if (!res.ok) throw new Error("Não foi possível carregar os dados");
        return res.text();
      })
      .then((raw) => {
        const csvText = raw.replace(/^\uFEFF/, "");
        const parsed = Papa.parse(csvText, { header: false, skipEmptyLines: true });
        const rows = parsed.data as string[][];
        setMetrics(parseAllMetrics(rows));
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8">
      <BackButton />

      <h1
        className="text-3xl font-bold tracking-tight text-center mb-8"
        style={{ color: "var(--text-primary)" }}
      >
        Análise de Desigualdade
      </h1>

      {error && (
        <p className="text-center py-8" style={{ color: "var(--brand-red)" }}>{error}</p>
      )}

      {!metrics && !error && (
        <p className="text-center py-8" style={{ color: "var(--text-secondary)" }}>Carregando...</p>
      )}

      {metrics && (
        <div className="space-y-12">
          {SECTIONS.map((section) => (
            <section key={section.key}>
              <h2
                className="text-xl font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {section.heading}
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                {section.explanation}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card-surface mb-6">
                  <InequalityLineChart
                    title={section.turnoverTitle}
                    yAxisLabel={section.yAxisLabel}
                    data={metrics[section.key].turnover}
                    lines={TURNOVER_LINES}
                    formatDecimals={section.formatDecimals}
                    footnote={TURNOVER_FOOTNOTE}
                    yDomain={section.yDomain}
                  />
                </div>
                <div className="card-surface mb-6">
                  <InequalityLineChart
                    title={section.broadcastTitle}
                    yAxisLabel={section.yAxisLabel}
                    data={metrics[section.key].broadcast}
                    lines={BROADCAST_LINES}
                    formatDecimals={section.formatDecimals}
                    footnote={BROADCAST_FOOTNOTE}
                    yDomain={section.yDomain}
                  />
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
