"use client";

import { useState } from "react";
import { clubs, getIconUrl } from "@/lib/clubs";
import type { Club } from "@/lib/clubs";
import BackButton from "@/components/BackButton";
import CompareBarChart from "@/components/CompareBarChart";

export default function Compare2Clubes() {
  const [selected1, setSelected1] = useState("");
  const [selected2, setSelected2] = useState("");

  const club1 = clubs.find((c) => c.name === selected1) as Club | undefined;
  const club2 = clubs.find((c) => c.name === selected2) as Club | undefined;

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8">
      <BackButton />

      <h1 className="text-2xl font-bold text-center mb-1">
        Compare 2 Clubes
      </h1>
      <p className="text-center text-gray-600 mb-6">(em R$ milhões)</p>

      <div className="flex flex-wrap justify-center items-start gap-8 mb-6">
        {/* Club 1 selector */}
        <div className="flex flex-col items-center gap-2 w-[200px]">
          <select
            value={selected1}
            onChange={(e) => setSelected1(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o Clube 1</option>
            {clubs.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="w-[72px] h-[72px] flex items-center justify-center">
            {club1 && (
              <img
                src={getIconUrl(club1)}
                alt={club1.name}
                className="max-w-[72px] max-h-[72px] object-contain rounded-full"
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
            {clubs.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="w-[72px] h-[72px] flex items-center justify-center">
            {club2 && (
              <img
                src={getIconUrl(club2)}
                alt={club2.name}
                className="max-w-[72px] max-h-[72px] object-contain rounded-full"
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
        <CompareBarChart club1={club1} club2={club2} />
      )}
    </main>
  );
}
