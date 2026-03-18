"use client";

import { useState } from "react";
import { clubs2024, DEFAULT_CLUB, getIconUrl, type Club, type Season } from "@/lib/clubs";
import { clubs2025 } from "@/lib/clubs2025";
import BackButton from "@/components/BackButton";
import SankeyChart from "@/components/SankeyChart";
import RadarChart from "@/components/RadarChart";
import HorizontalBarChart from "@/components/HorizontalBarChart";
import ClubSummary from "@/components/ClubSummary";
import { useModulo1Data } from "@/hooks/useModulo1Data";

function getClubsForSeason(season: Season): Club[] {
  return season === "2025" ? clubs2025 : clubs2024;
}

export default function AnaliseIndividual() {
  const [season, setSeason] = useState<Season>("2025");
  const [selectedName, setSelectedName] = useState<string | null>("Vasco");

  const clubList = getClubsForSeason(season);
  const club = selectedName ? clubList.find((c) => c.name === selectedName) ?? null : null;

  const {
    resumoHtml,
    resumoLoading,
    sankeyData,
    sankeyError,
    sankeyLoading,
    radarData,
    radarError,
    radarLoading,
    barData,
    barError,
    barLoading,
    barNoPriorData,
  } = useModulo1Data(club, season);

  function handleSeasonChange(newSeason: Season) {
    setSeason(newSeason);
    setSelectedName("Vasco"); // Reset to default club when season changes
  }

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8">
      <BackButton />

      <h1 className="text-2xl font-bold text-center mb-1">
        Análise Individual
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

      {/* Prompt when no club selected */}
      {!club && (
        <p className="text-center text-gray-500 italic py-8">
          Selecione um clube para visualizar a análise.
        </p>
      )}

      {/* Content — only rendered when a club is selected */}
      {club && (
        <>
          <ClubSummary content={resumoHtml} loading={resumoLoading} clubSelected={!!club} />

          <hr className="mb-8" />

          <div className="flex flex-col gap-16">
            <section>
              <SankeyChart
                clubName={club.name}
                data={sankeyData}
                error={sankeyError}
                loading={sankeyLoading}
              />
            </section>

            <section>
              <RadarChart
                data={radarData}
                error={radarError}
                loading={radarLoading}
              />
            </section>

            <section>
              <HorizontalBarChart
                clubName={club.name}
                season={season}
                data={barData}
                error={barError}
                loading={barLoading}
                noPriorData={barNoPriorData}
              />
            </section>
          </div>
        </>
      )}
    </main>
  );
}
