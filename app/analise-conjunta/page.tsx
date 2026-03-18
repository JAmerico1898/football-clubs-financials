"use client";

import { useState, useMemo } from "react";
import { clubs2024, getIconUrl, type Club } from "@/lib/clubs";
import { clubs2025 } from "@/lib/clubs2025";
import { xAxisMetrics, yAxisMetrics } from "@/lib/scatter-config";
import BackButton from "@/components/BackButton";
import ScatterPlotChart, { type ScatterPeriod } from "@/components/ScatterPlotChart";

function getClubsForPeriod(period: ScatterPeriod): Club[] {
  if (period === "2025") return clubs2025;
  if (period === "2024") return clubs2024;
  // Combined: union of both, deduplicated by name, Vasco first then A-Z
  const map = new Map<string, Club>();
  for (const c of [...clubs2025, ...clubs2024]) {
    if (!map.has(c.name)) map.set(c.name, c);
  }
  const all = Array.from(map.values());
  const vasco = all.filter((c) => c.name === "Vasco");
  const rest = all.filter((c) => c.name !== "Vasco").sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  return [...vasco, ...rest];
}

const PERIOD_OPTIONS: { value: ScatterPeriod; label: string }[] = [
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "both", label: "2025 & 2024" },
];

export default function AnaliseConjunta() {
  const [period, setPeriod] = useState<ScatterPeriod>("2025");
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");

  const clubList = useMemo(() => getClubsForPeriod(period), [period]);
  const club = selectedName ? clubList.find((c) => c.name === selectedName) ?? null : null;

  const xMetric = xAxisMetrics.find((m) => m.csvKey === xKey);
  const yMetric = yAxisMetrics.find((m) => m.csvKey === yKey);

  function handlePeriodChange(newPeriod: ScatterPeriod) {
    setPeriod(newPeriod);
    setSelectedName(null);
  }

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8">
      <BackButton />

      <h1 className="text-2xl font-bold text-center mb-1">
        Análise Conjunta
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Explore as finanças dos clubes do Brasileirão
      </p>

      {/* Period selector */}
      <div className="flex justify-center gap-2 mb-4">
        {PERIOD_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handlePeriodChange(opt.value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              period === opt.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Club dropdown + icon */}
      <div className="flex flex-col items-center gap-4 mb-6">
        <select
          value={selectedName ?? ""}
          onChange={(e) => setSelectedName(e.target.value || null)}
          className="px-4 py-2 border border-gray-300 rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione um clube</option>
          {clubList.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        {club && (
          <img
            src={getIconUrl(club)}
            alt={club.name}
            width={96}
            height={96}
            className="object-contain"
          />
        )}
      </div>

      {/* Metric selectors */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <div className="flex flex-col items-center gap-1">
          <label className="text-sm font-medium text-gray-600">
            Variável - Eixo X
          </label>
          <select
            value={xKey}
            onChange={(e) => setXKey(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione...</option>
            {xAxisMetrics.map((m) => (
              <option key={m.csvKey} value={m.csvKey}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col items-center gap-1">
          <label className="text-sm font-medium text-gray-600">
            Variável - Eixo Y
          </label>
          <select
            value={yKey}
            onChange={(e) => setYKey(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione...</option>
            {yAxisMetrics.map((m) => (
              <option key={m.csvKey} value={m.csvKey}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <hr className="mb-8" />

      {!selectedName || !xMetric || !yMetric ? (
        <p className="text-center text-gray-500 mt-16">
          Selecione um clube e as métricas dos eixos para visualizar.
        </p>
      ) : (
        <ScatterPlotChart
          xMetric={xMetric}
          yMetric={yMetric}
          period={period}
          selectedClub={selectedName}
        />
      )}
    </main>
  );
}
