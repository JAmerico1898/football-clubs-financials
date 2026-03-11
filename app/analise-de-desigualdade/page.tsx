"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import BackButton from "@/components/BackButton";
import InequalityLineChart, { LineConfig } from "@/components/InequalityLineChart";

const SEASONS = ["2020/21", "2021/22", "2022/23", "2023/24", "2024/25"];

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

// Column ranges for each league in the CSV
// Brasileirão turnover: cols 0-3 (4 years: 2021-2024 → seasons[0]-[3])
// EPL turnover: cols 4-8 (5 years)
// La Liga broadcast: cols 9-13
// Bundesliga broadcast: cols 14-18
// Serie A broadcast: cols 19-23
// EPL broadcast: cols 24-28

function parseLeagueValues(row: string[], startCol: number, count: number): (number | null)[] {
  const values: (number | null)[] = [];
  for (let i = 0; i < count; i++) {
    const raw = row[startCol + i];
    const val = parseFloat(raw);
    values.push(isNaN(val) ? null : val);
  }
  return values;
}

function buildChartData(
  giniRow: string[],
  maxMinRow: string[]
): {
  giniTurnover: Record<string, string | number | null>[];
  giniBroadcast: Record<string, string | number | null>[];
  maxMinTurnover: Record<string, string | number | null>[];
  maxMinBroadcast: Record<string, string | number | null>[];
} {
  // Parse gini values per league
  const giniBR = parseLeagueValues(giniRow, 0, 4);
  const giniEPL_T = parseLeagueValues(giniRow, 4, 5);
  const giniLaLiga = parseLeagueValues(giniRow, 9, 5);
  const giniBundesliga = parseLeagueValues(giniRow, 14, 5);
  const giniSerieA = parseLeagueValues(giniRow, 19, 5);
  const giniEPL_B = parseLeagueValues(giniRow, 24, 5);

  // Parse max-min values per league
  const mmBR = parseLeagueValues(maxMinRow, 0, 4);
  const mmEPL_T = parseLeagueValues(maxMinRow, 4, 5);
  const mmLaLiga = parseLeagueValues(maxMinRow, 9, 5);
  const mmBundesliga = parseLeagueValues(maxMinRow, 14, 5);
  const mmSerieA = parseLeagueValues(maxMinRow, 19, 5);
  const mmEPL_B = parseLeagueValues(maxMinRow, 24, 5);

  const giniTurnover = SEASONS.map((season, i) => ({
    season,
    brasileirao: i < 4 ? giniBR[i] : null,
    epl_turnover: giniEPL_T[i],
  }));

  const giniBroadcast = SEASONS.map((season, i) => ({
    season,
    epl_broadcast: giniEPL_B[i],
    laliga: giniLaLiga[i],
    bundesliga: giniBundesliga[i],
    seriea: giniSerieA[i],
  }));

  const maxMinTurnover = SEASONS.map((season, i) => ({
    season,
    brasileirao: i < 4 ? mmBR[i] : null,
    epl_turnover: mmEPL_T[i],
  }));

  const maxMinBroadcast = SEASONS.map((season, i) => ({
    season,
    epl_broadcast: mmEPL_B[i],
    laliga: mmLaLiga[i],
    bundesliga: mmBundesliga[i],
    seriea: mmSerieA[i],
  }));

  return { giniTurnover, giniBroadcast, maxMinTurnover, maxMinBroadcast };
}

export default function AnaliseDeDesigualdade() {
  const [chartData, setChartData] = useState<ReturnType<typeof buildChartData> | null>(null);
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

        // Find label rows dynamically
        const giniLabelIdx = rows.findIndex((r) => r[0]?.trim() === "Gini Index");
        const maxMinLabelIdx = rows.findIndex((r) => r[0]?.trim() === "Max/Min Ratio");

        if (giniLabelIdx < 0 || maxMinLabelIdx < 0) {
          throw new Error("CSV com formato inesperado: labels não encontrados");
        }

        const giniRow = rows[giniLabelIdx + 1];
        const maxMinRow = rows[maxMinLabelIdx + 1];

        if (!giniRow || !maxMinRow) {
          throw new Error("CSV com formato inesperado: linhas de valores ausentes");
        }

        setChartData(buildChartData(giniRow, maxMinRow));
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8">
      <BackButton />

      <h1 className="text-2xl font-bold text-center mb-8">
        Análise de Desigualdade
      </h1>

      {error && (
        <p className="text-center text-red-500 py-8">{error}</p>
      )}

      {!chartData && !error && (
        <p className="text-center text-gray-500 py-8">Carregando...</p>
      )}

      {chartData && (
        <div className="space-y-12">
          {/* Section 1: Gini Index */}
          <section>
            <h2 className="text-xl font-bold mb-2">Índice de Gini</h2>
            <p className="text-gray-600 text-sm mb-6">
              O Índice de Gini mede a desigualdade na distribuição de receitas entre os clubes de uma liga.
              Valores mais próximos de 0 indicam maior igualdade, enquanto valores mais próximos de 1
              indicam maior concentração de receita em poucos clubes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InequalityLineChart
                title="Índice de Gini — Receita Total"
                yAxisLabel="Gini"
                data={chartData.giniTurnover}
                lines={TURNOVER_LINES}
                formatDecimals={4}
                footnote={TURNOVER_FOOTNOTE}
              />
              <InequalityLineChart
                title="Índice de Gini — Receita de Transmissão"
                yAxisLabel="Gini"
                data={chartData.giniBroadcast}
                lines={BROADCAST_LINES}
                formatDecimals={4}
                footnote={BROADCAST_FOOTNOTE}
              />
            </div>
          </section>

          {/* Section 2: Máx/Mín Ratio */}
          <section>
            <h2 className="text-xl font-bold mb-2">Razão Máx/Mín</h2>
            <p className="text-gray-600 text-sm mb-6">
              A Razão Máx/Mín divide a maior receita pela menor receita.
              Quanto maior o valor, maior a disparidade entre o topo e a base da competição.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InequalityLineChart
                title="Razão Máx/Mín — Receita Total"
                yAxisLabel="Máx/Mín"
                data={chartData.maxMinTurnover}
                lines={TURNOVER_LINES}
                formatDecimals={2}
                footnote={TURNOVER_FOOTNOTE}
              />
              <InequalityLineChart
                title="Razão Máx/Mín — Receita de Transmissão"
                yAxisLabel="Máx/Mín"
                data={chartData.maxMinBroadcast}
                lines={BROADCAST_LINES}
                formatDecimals={2}
                footnote={BROADCAST_FOOTNOTE}
              />
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
