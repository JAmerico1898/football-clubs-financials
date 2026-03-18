"use client";

import { useState } from "react";
import { clubs2024, DEFAULT_CLUB, getIconUrl, type Club, type Season } from "@/lib/clubs";
import { clubs2025 } from "@/lib/clubs2025";
import { metrics } from "@/lib/metric-config";
import BackButton from "@/components/BackButton";
import MetricSelector from "@/components/MetricSelector";
import ComparisonBarChart from "@/components/ComparisonBarChart";
import EvolutionLineChart from "@/components/EvolutionLineChart";

function getClubsForSeason(season: Season): Club[] {
  return season === "2025" ? clubs2025 : clubs2024;
}

export default function AnaliseComparativaSimples() {
  const [season, setSeason] = useState<Season>("2025");
  const [selected, setSelected] = useState(DEFAULT_CLUB);
  const [metricKey, setMetricKey] = useState("");

  const clubList = getClubsForSeason(season);
  const club = clubList.find((c) => c.name === selected) ?? null;
  const metric = metrics.find((m) => m.csvKey === metricKey);

  function handleSeasonChange(newSeason: Season) {
    setSeason(newSeason);
    setSelected("Vasco");
  }

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8">
      <BackButton />

      <h1 className="text-2xl font-bold text-center mb-1">
        Análise Comparativa Simples
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Explore as finanças dos clubes do Brasileirão
      </p>

      {/* Season selector */}
      <div className="flex justify-center gap-2 mb-4">
        {(["2025", "2024"] as Season[]).map((s) => (
          <button
            key={s}
            onClick={() => handleSeasonChange(s)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              season === s
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 mb-6">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
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
        <MetricSelector value={metricKey} onChange={setMetricKey} />
      </div>

      <hr className="mb-8" />

      {!metric || !club ? (
        <p className="text-center text-gray-500 mt-16">
          Selecione um clube e uma métrica para visualizar.
        </p>
      ) : (
        <div className="flex flex-col gap-16">
          <section>
            <ComparisonBarChart club={club} metric={metric} season={season} />
          </section>
          <section>
            <EvolutionLineChart club={club} metric={metric} season={season} />
          </section>
        </div>
      )}
    </main>
  );
}
