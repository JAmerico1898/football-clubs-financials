"use client";

import { useState } from "react";
import { type ScatterPeriod } from "@/lib/clubs";
import { xAxisMetrics, yAxisMetrics } from "@/lib/scatter-config";
import BackButton from "@/components/BackButton";
import ScatterPlotChart from "@/components/ScatterPlotChart";

const periods: ScatterPeriod[] = ["2025", "2024", "2025 & 2024"];

export default function AnaliseConjunta() {
  const [period, setPeriod] = useState<ScatterPeriod>("2025");
  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");

  const xMetric = xAxisMetrics.find((m) => m.csvKey === xKey);
  const yMetric = yAxisMetrics.find((m) => m.csvKey === yKey);

  function handlePeriodChange(p: ScatterPeriod) {
    setPeriod(p);
  }

  function handleXChange(value: string) {
    setXKey(value);
    if (value && value === yKey) setYKey("");
  }

  function handleYChange(value: string) {
    setYKey(value);
    if (value && value === xKey) setXKey("");
  }

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8">
      <BackButton />

      <h1 className="text-2xl font-bold text-center mb-6">
        Análise Conjunta
      </h1>

      {/* Period selector */}
      <div className="flex justify-center gap-2 mb-4">
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => handlePeriodChange(p)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              period === p
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <div className="flex flex-col items-center gap-1">
          <label className="text-sm font-medium text-gray-600">
            Variável - Eixo X
          </label>
          <select
            value={xKey}
            onChange={(e) => handleXChange(e.target.value)}
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
            onChange={(e) => handleYChange(e.target.value)}
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

      {!xMetric || !yMetric ? (
        <p className="text-center text-gray-500 mt-16">
          Selecione as métricas dos eixos para visualizar.
        </p>
      ) : (
        <ScatterPlotChart xMetric={xMetric} yMetric={yMetric} period={period} />
      )}
    </main>
  );
}
