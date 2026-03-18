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

      <h1 className="text-3xl font-bold tracking-tight text-center mb-6" style={{ color: "var(--text-primary)" }}>
        Análise Conjunta
      </h1>

      <div className="card-surface mb-6">
        {/* Period selector */}
        <div className="flex justify-center mb-4">
          <div className="pill-group">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                className={period === p ? "pill-btn-active" : "pill-btn"}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Variável - Eixo X
            </label>
            <select
              value={xKey}
              onChange={(e) => handleXChange(e.target.value)}
              className="select-themed"
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
            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Variável - Eixo Y
            </label>
            <select
              value={yKey}
              onChange={(e) => handleYChange(e.target.value)}
              className="select-themed"
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
      </div>

      <hr className="mb-8" />

      {!xMetric || !yMetric ? (
        <p className="text-center mt-16" style={{ color: "var(--text-secondary)" }}>
          Selecione as métricas dos eixos para visualizar.
        </p>
      ) : (
        <div className="card-surface mb-6">
          <ScatterPlotChart xMetric={xMetric} yMetric={yMetric} period={period} />
        </div>
      )}
    </main>
  );
}
