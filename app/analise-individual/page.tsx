"use client";

import { useState } from "react";
import { clubs2024, DEFAULT_CLUB, getIconUrl, getBackdropUrl, type Club, type Season } from "@/lib/clubs";
import { clubs2025 } from "@/lib/clubs2025";
import BackButton from "@/components/BackButton";
import SankeyChart from "@/components/SankeyChart";
import RadarChart from "@/components/RadarChart";
import HorizontalBarChart from "@/components/HorizontalBarChart";
import ClubSummary from "@/components/ClubSummary";
import MetricHighlights from "@/components/MetricHighlights";
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

  const allLoaded = !sankeyLoading && !radarLoading && !barLoading;
  const barAllZero = barData != null && barData.every((d) => d.valCurrent === 0);
  const noDataAvailable = allLoaded && !!club && !!sankeyError && !!radarError && barAllZero;

  function handleSeasonChange(newSeason: Season) {
    setSeason(newSeason);
    // Keep the current selection if the club exists in the new season; otherwise fall back to Vasco
    const newClubs = getClubsForSeason(newSeason);
    if (selectedName && !newClubs.find((c) => c.name === selectedName)) {
      setSelectedName("Vasco");
    }
  }

  return (
    <>
      {/* Fixed grass background + light green overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/grass-bg.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 light-page-bg-overlay" />
      </div>

    <main className="relative z-10 max-w-[1200px] mx-auto px-4 py-8">
      <BackButton />

      <h1 className="text-3xl font-bold tracking-tight text-center mb-1" style={{ color: "var(--text-primary)" }}>
        Análise Individual
      </h1>
      <p className="text-center mb-6" style={{ color: "var(--text-secondary)" }}>
        Explore as finanças dos clubes do Brasileirão
      </p>

      <div className="card-surface mb-6 relative overflow-hidden">
        {/* Club backdrop watermark */}
        {club && (
          <img
            key={club.fileKey}
            src={getBackdropUrl(club)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-[0.15] pointer-events-none blur-[1px]"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        {/* Season selector */}
        <div className="relative z-10 flex justify-center mb-4">
          <div className="pill-group shadow-md">
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

        {/* Club dropdown + icon */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <select
            value={selectedName ?? ""}
            onChange={(e) => setSelectedName(e.target.value || null)}
            className="select-themed shadow-md"
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
              width={120}
              height={120}
              className="object-contain"
            />
          )}
        </div>
      </div>

      {/* Prompt when no club selected */}
      {!club && (
        <p className="text-center italic py-8" style={{ color: "var(--text-secondary)" }}>
          Selecione um clube para visualizar a análise.
        </p>
      )}

      {/* Content — only rendered when a club is selected */}
      {club && noDataAvailable && (
        <div
          className="card-surface text-center py-8 px-4"
          style={{ color: "var(--text-secondary)" }}
        >
          <p className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
            Nota: {club.name} não disponibilizou suas Demonstrações Financeiras completas no site oficial.
          </p>
        </div>
      )}

      {club && !noDataAvailable && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 mb-8">
            <MetricHighlights barData={barData} loading={barLoading} season={season} />
            <ClubSummary content={resumoHtml} loading={resumoLoading} clubSelected={!!club} />
          </div>

          <div className="flex flex-col gap-16">
            <section className="card-surface relative isolate">
              <SankeyChart
                clubName={club.name}
                data={sankeyData}
                error={sankeyError}
                loading={sankeyLoading}
              />
            </section>

            <section className="card-surface relative isolate">
              <RadarChart
                data={radarData}
                error={radarError}
                loading={radarLoading}
              />
            </section>

            <section className="card-surface">
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
    </>
  );
}
