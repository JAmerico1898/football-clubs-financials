"use client";

import { useState } from "react";
import { clubs, DEFAULT_CLUB, getIconUrl } from "@/lib/clubs";
import BackButton from "@/components/BackButton";
import SankeyChart from "@/components/SankeyChart";
import RadarChart from "@/components/RadarChart";
import HorizontalBarChart from "@/components/HorizontalBarChart";

export default function AnaliseIndividual2024() {
  const [selected, setSelected] = useState(DEFAULT_CLUB);
  const club = clubs.find((c) => c.name === selected)!;

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8">
      <BackButton />

      <h1 className="text-2xl font-bold text-center mb-1">
        Análise Individual
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
      </div>

      <hr className="mb-8" />

      <div className="flex flex-col gap-16">
        <section>
          <SankeyChart club={club} />
        </section>

        <section>
          <RadarChart club={club} />
        </section>

        <section>
          <HorizontalBarChart club={club} />
        </section>
      </div>
    </main>
  );
}
