"use client";

import { useState } from "react";
import { clubs, DEFAULT_CLUB, getIconUrl } from "@/lib/clubs";
import { metrics } from "@/lib/metric-config";
import BackButton from "@/components/BackButton";
import MetricSelector from "@/components/MetricSelector";
import ComparisonBarChart from "@/components/ComparisonBarChart";
import EvolutionLineChart from "@/components/EvolutionLineChart";

export default function AnaliseComparativaSimples() {
  const [selected, setSelected] = useState(DEFAULT_CLUB);
  const [metricKey, setMetricKey] = useState("");

  const club = clubs.find((c) => c.name === selected)!;
  const metric = metrics.find((m) => m.csvKey === metricKey);

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8">
      <BackButton />

      <h1 className="text-2xl font-bold text-center mb-1">
        Análise Comparativa Simples
      </h1>
      <p className="text-center text-gray-600 mb-6">(em R$ milhões)</p>

      <div className="flex flex-col items-center gap-4 mb-6">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {clubs.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <img
          src={getIconUrl(club)}
          alt={club.name}
          width={72}
          height={72}
          className="rounded-full"
        />
        <MetricSelector value={metricKey} onChange={setMetricKey} />
      </div>

      <hr className="mb-8" />

      {!metric ? (
        <p className="text-center text-gray-500 mt-16">
          Selecione um clube e uma métrica
        </p>
      ) : (
        <div className="flex flex-col gap-16">
          <section>
            <ComparisonBarChart club={club} metric={metric} />
          </section>
          <section>
            <EvolutionLineChart club={club} metric={metric} />
          </section>
        </div>
      )}
    </main>
  );
}
