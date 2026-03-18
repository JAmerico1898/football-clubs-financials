"use client";

import { useState } from "react";
import { clubs2024, getIconUrl, type Club, type Season } from "@/lib/clubs";
import { clubs2025 } from "@/lib/clubs2025";
import BackButton from "@/components/BackButton";
import CompareBarChart from "@/components/CompareBarChart";

function getClubsForSeason(season: Season): Club[] {
  const source = season === "2025" ? clubs2025 : clubs2024;
  return [
    ...source.filter((c) => c.name === "Vasco"),
    ...source.filter((c) => c.name !== "Vasco").sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
  ];
}

export default function Compare2Clubes() {
  const [season, setSeason] = useState<Season>("2025");
  const [selected1, setSelected1] = useState("");
  const [selected2, setSelected2] = useState("");

  const clubList = getClubsForSeason(season);

  function handleSeasonChange(newSeason: Season) {
    setSeason(newSeason);
    const newList = getClubsForSeason(newSeason);
    const names = new Set(newList.map((c) => c.name));
    if (!names.has(selected1)) setSelected1("");
    if (!names.has(selected2)) setSelected2("");
  }

  const club1 = clubList.find((c) => c.name === selected1) as Club | undefined;
  const club2 = clubList.find((c) => c.name === selected2) as Club | undefined;

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8">
      <BackButton />

      <h1 className="text-2xl font-bold text-center mb-1">
        Compare 2 Clubes
      </h1>
      <p className="text-center text-gray-600 mb-6">(em R$ milhões)</p>

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

      <div className="flex flex-wrap justify-center items-start gap-8 mb-6">
        {/* Club 1 selector */}
        <div className="flex flex-col items-center gap-2 w-[200px]">
          <select
            value={selected1}
            onChange={(e) => setSelected1(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o Clube 1</option>
            {clubList.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="w-[96px] h-[96px] flex items-center justify-center">
            {club1 && (
              <img
                src={getIconUrl(club1)}
                alt={club1.name}
                className="max-w-[96px] max-h-[96px] object-contain"
              />
            )}
          </div>
        </div>

        <span className="text-2xl font-bold text-gray-400 mt-2">vs.</span>

        {/* Club 2 selector */}
        <div className="flex flex-col items-center gap-2 w-[200px]">
          <select
            value={selected2}
            onChange={(e) => setSelected2(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o Clube 2</option>
            {clubList.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="w-[96px] h-[96px] flex items-center justify-center">
            {club2 && (
              <img
                src={getIconUrl(club2)}
                alt={club2.name}
                className="max-w-[96px] max-h-[96px] object-contain"
              />
            )}
          </div>
        </div>
      </div>

      <hr className="mb-8" />

      {!club1 || !club2 ? (
        <p className="text-center text-gray-500 mt-16">
          Selecione dois clubes para comparar.
        </p>
      ) : (
        <CompareBarChart club1={club1} club2={club2} season={season} />
      )}
    </main>
  );
}
