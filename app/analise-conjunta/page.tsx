"use client";

import { useState } from "react";
import { xAxisMetrics, yAxisMetrics } from "@/lib/scatter-config";
import BackButton from "@/components/BackButton";
import ScatterPlotChart from "@/components/ScatterPlotChart";

export default function AnaliseConjunta() {
  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");

  const xMetric = xAxisMetrics.find((m) => m.csvKey === xKey);
  const yMetric = yAxisMetrics.find((m) => m.csvKey === yKey);

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8">
      <BackButton />

      <h1 className="text-2xl font-bold text-center mb-6">
        Análise Conjunta
      </h1>

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

      {!xMetric || !yMetric ? (
        <p className="text-center text-gray-500 mt-16">
          Selecione as métricas dos eixos para visualizar.
        </p>
      ) : (
        <ScatterPlotChart xMetric={xMetric} yMetric={yMetric} />
      )}
    </main>
  );
}
