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

      <h1 className="text-3xl font-bold tracking-tight text-center mb-1" style={{ color: "var(--text-primary)" }}>
        Análise Comparativa Simples
      </h1>
      <p className="text-center mb-6" style={{ color: "var(--text-secondary)" }}>
        Explore as finanças dos clubes do Brasileirão
      </p>

      <div className="card-surface mb-6">
        {/* Season selector */}
        <div className="flex justify-center mb-4">
          <div className="pill-group">
            {(["2025", "2024"] as Season[]).map((s) => (
              <button
                key={s}
                onClick={() => handleSeasonChange(s)}
                className={season === s ? "pill-btn-active" : "pill-btn"}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="select-themed"
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
      </div>

      <hr className="mb-8" />

      {!metric || !club ? (
        <p className="text-center mt-16" style={{ color: "var(--text-secondary)" }}>
          Selecione um clube e uma métrica para visualizar.
        </p>
      ) : (
        <div className="flex flex-col gap-16">
          <section className="card-surface mb-6">
            <ComparisonBarChart club={club} metric={metric} season={season} />
          </section>
          <section className="card-surface mb-6">
            <EvolutionLineChart club={club} metric={metric} season={season} />
          </section>
        </div>
      )}
    </main>
  );
}
