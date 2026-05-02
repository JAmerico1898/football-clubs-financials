"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import ModuleNavbar from "@/components/ModuleNavbar";
import CategorySelector from "@/components/CategorySelector";
import InequalityChart from "@/components/InequalityChart";
import {
  DEFAULT_CATEGORIES,
  METRIC_LABELS,
} from "@/lib/desigualdade-constants";

type WideRow = Record<string, number>;

interface SectionConfig {
  metricLabel: string;
  heading: string;
  explanation: string;
  chartTitle: string;
  yAxisLabel: string;
  yDomain: [number, number] | "auto";
  yTickDecimals: number;
  premierLeagueComparison: { prefix: string; value: string };
}

const SECTIONS: SectionConfig[] = [
  {
    metricLabel: METRIC_LABELS[0],
    heading: "Índice de Gini",
    explanation:
      "O Índice de Gini mede a desigualdade na distribuição de uma grandeza entre os clubes de uma liga. O valor varia de 0 (igualdade perfeita — todos os clubes com o mesmo valor) a 1 (desigualdade máxima — um único clube concentra todo o valor). Quanto maior o índice, mais concentrada é a riqueza ou o custo na liga.",
    chartTitle: "Índice de Gini — Brasileirão (2021–2025)",
    yAxisLabel: "Índice de Gini",
    yDomain: [0, 1],
    yTickDecimals: 4,
    premierLeagueComparison: {
      prefix:
        "Nota: Para efeito de comparação, o Índice de Gini da Premier League na temporada 2024/25 foi de ",
      value: "0,32",
    },
  },
  {
    metricLabel: METRIC_LABELS[1],
    heading: "Razão Max/Min",
    explanation:
      "A Razão Max/Min compara o valor do clube líder com o do clube de menor expressão na mesma grandeza. Um valor de 10, por exemplo, significa que o clube com maior receita operacional arrecada 10 vezes mais do que o clube com menor receita operacional. É uma medida direta da amplitude da desigualdade.",
    chartTitle: "Razão Max/Min — Brasileirão (2021–2025)",
    yAxisLabel: "Razão Max/Min",
    yDomain: "auto",
    yTickDecimals: 2,
    premierLeagueComparison: {
      prefix:
        "Nota: Para efeito de comparação, a Razão Max/Min da Premier League na temporada 2024/25 foi de ",
      value: "4,62",
    },
  },
  {
    metricLabel: METRIC_LABELS[2],
    heading: "Concentração C5 (Top 5)",
    explanation:
      "A Concentração C5 (ou Razão C5) divide a soma dos valores dos cinco clubes mais expressivos pelo total da competição. Revela o grau de concentração nos 5 maiores. Um valor de 0,55, por exemplo, indica que os 5 maiores clubes concentram 55% da grandeza analisada na liga.",
    chartTitle: "Concentração C5 — Brasileirão (2021–2025)",
    yAxisLabel: "Concentração C5",
    yDomain: [0, 1],
    yTickDecimals: 4,
    premierLeagueComparison: {
      prefix:
        "Nota: Para efeito de comparação, a Concentração C5 na Premier League na temporada 2024/25 foi de ",
      value: "0,49",
    },
  },
  {
    metricLabel: METRIC_LABELS[3],
    heading: "Concentração C3 (Top 3)",
    explanation:
      "A Concentração C3 (ou Razão C3) divide a soma dos valores dos três clubes mais expressivos pelo total da competição. Revela o grau de concentração nos 3 maiores. Um valor de 0,40, por exemplo, indica que os 3 maiores clubes concentram 40% da grandeza analisada na liga.",
    chartTitle: "Concentração C3 — Brasileirão (2021–2025)",
    yAxisLabel: "Concentração C3",
    yDomain: [0, 1],
    yTickDecimals: 4,
    premierLeagueComparison: {
      prefix:
        "Nota: Para efeito de comparação, a Concentração C3 na Premier League na temporada 2024/25 foi de ",
      value: "0,31",
    },
  },
];

function parseDesigualdadeCSV(
  raw: string
): Record<string, WideRow[]> {
  const csvText = raw.replace(/^\uFEFF/, "");
  const parsed = Papa.parse<string[]>(csvText, { header: false });
  const rows = parsed.data as string[][];

  const result: Record<string, WideRow[]> = {};

  for (const label of METRIC_LABELS) {
    const labelIdx = rows.findIndex(
      (r) => r[0]?.trim() === label
    );
    if (labelIdx < 0) throw new Error(`Bloco "${label}" não encontrado no CSV`);

    // Header row has year labels in columns 1–5
    const headerRow = rows[labelIdx];
    const years = headerRow.slice(1, 6).map((y) => Math.round(parseFloat(y)));

    // 9 data rows follow immediately after the label row
    const dataRows = rows.slice(labelIdx + 1, labelIdx + 10);

    // Build wide-format: one object per year
    const wide: WideRow[] = years.map((year) => ({ year }));

    for (const dataRow of dataRows) {
      const category = dataRow[0]?.trim();
      if (!category) continue;

      for (let i = 0; i < years.length; i++) {
        const val = parseFloat(dataRow[i + 1]);
        wide[i][category] = isNaN(val) ? 0 : val;
      }
    }

    result[label] = wide;
  }

  return result;
}

export default function AnaliseDeDesigualdade() {
  const [data, setData] = useState<Record<string, WideRow[]> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activated, setActivated] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    fetch("/data/desigualdade.csv")
      .then((res) => {
        if (!res.ok) throw new Error("Não foi possível carregar os dados");
        return res.text();
      })
      .then((raw) => setData(parseDesigualdadeCSV(raw)))
      .catch((err) => setError(err.message));
  }, []);

  const visibleCategories = activated ? selected : DEFAULT_CATEGORIES;

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
          Análise de Desigualdade
        </h1>

        <p
          className="text-sm text-center mb-8 max-w-2xl mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Evolução da desigualdade financeira entre os clubes do Brasileirão
          entre 2021 e 2025, medida por quatro indicadores complementares:
          Índice de Gini, Razão Max/Min, Concentração C3 e Concentração C5.
          Cada métrica mostra, sob ângulos distintos, o quanto receitas,
          custos e demais grandezas estão distribuídos — ou concentrados —
          nas mãos dos maiores clubes da liga.
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
            {/* Shared category selector */}
            <div className="card-surface p-6">
              <CategorySelector
                selected={selected}
                setSelected={setSelected}
                activated={activated}
                setActivated={setActivated}
              />
            </div>

            {/* Metric sections */}
            {SECTIONS.map((section) => (
              <section key={section.metricLabel} className="card-surface p-6">
                <h2
                  className="text-xl font-bold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {section.heading}
                </h2>
                <p
                  className="text-sm mb-6 leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {section.explanation}
                </p>
                <InequalityChart
                  title={section.chartTitle}
                  yAxisLabel={section.yAxisLabel}
                  yDomain={section.yDomain}
                  yTickDecimals={section.yTickDecimals}
                  data={data[section.metricLabel]}
                  visibleCategories={visibleCategories}
                />
                {visibleCategories.includes("Receita Operacional") && (
                  <p
                    className="text-xs italic mt-3 leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {section.premierLeagueComparison.prefix}
                    <strong style={{ color: "var(--text-primary)" }}>
                      {section.premierLeagueComparison.value}
                    </strong>
                  </p>
                )}
              </section>
            ))}
          </div>
        )}
        <ModuleNavbar />
      </main>
    </>
  );
}
