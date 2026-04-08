"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import ModuleNavbar from "@/components/ModuleNavbar";
import TransparencyChart, {
  TransparencyDatum,
} from "@/components/TransparencyChart";
import TransparencyTable from "@/components/TransparencyTable";
import { clubs, getIconUrl } from "@/lib/clubs";
import { clubs2025 } from "@/lib/clubs2025";

const SEASON_CLUB_NAMES = new Set(clubs2025.map((c) => c.name));
const SEASON_CLUB_CSV = new Set(clubs2025.map((c) => c.csvColumn));

export default function IndiceDeTransparencia() {
  const [data, setData] = useState<TransparencyDatum[] | null>(null);
  const [iconMap, setIconMap] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/Transparência.csv")
      .then((res) => {
        if (!res.ok) throw new Error("Não foi possível carregar os dados");
        return res.text();
      })
      .then((raw) => {
        const csvText = raw.replace(/^\uFEFF/, "");
        const parsed = Papa.parse(csvText, {
          header: false,
          skipEmptyLines: true,
        });
        const rows = parsed.data as string[][];

        if (rows.length < 2) throw new Error("CSV com formato inesperado");

        // Row 0 is the header: Ano, Nível de Transparência, Rubrica, Club1, Club2, ...
        const header = rows[0];
        // Club columns start at index 3 (column D)
        const clubIndices: { col: number; name: string }[] = [];
        for (let c = 3; c < header.length; c++) {
          const name = header[c]?.trim();
          if (name && name !== "Média da Liga") clubIndices.push({ col: c, name });
        }

        // Aggregate scores per level per club
        const accum: Record<string, { nivel1: number; nivel2: number; nivel3: number }> = {};
        for (const ci of clubIndices) {
          accum[ci.name] = { nivel1: 0, nivel2: 0, nivel3: 0 };
        }

        for (let r = 1; r < rows.length; r++) {
          const nivel = (rows[r][1] || "").trim();
          let key: "nivel1" | "nivel2" | "nivel3" | null = null;
          if (nivel.startsWith("Nível 1")) key = "nivel1";
          else if (nivel.startsWith("Nível 2")) key = "nivel2";
          else if (nivel.startsWith("Nível 3")) key = "nivel3";
          if (!key) continue;

          for (const ci of clubIndices) {
            const val = parseFloat((rows[r][ci.col] || "").replace(",", "."));
            if (!isNaN(val)) accum[ci.name][key] += val;
          }
        }

        // Build items, filtering to 2025 season clubs
        const items: TransparencyDatum[] = [];
        for (const ci of clubIndices) {
          const a = accum[ci.name];
          // Match against clubs2025 list via clubs registry
          const clubEntry = clubs.find(
            (c) => c.csvColumn === ci.name || c.name === ci.name
          );
          if (!SEASON_CLUB_CSV.has(ci.name) && !SEASON_CLUB_NAMES.has(ci.name) &&
              !(clubEntry && (SEASON_CLUB_NAMES.has(clubEntry.name) || SEASON_CLUB_CSV.has(clubEntry.csvColumn)))) continue;

          const total = a.nivel1 + a.nivel2 + a.nivel3;
          items.push({
            club: ci.name,
            nivel1: a.nivel1,
            nivel2: a.nivel2,
            nivel3: a.nivel3,
            total,
          });
        }

        items.sort((a, b) => b.total - a.total);
        setData(items);

        const allClubs = [...clubs, ...clubs2025];
        const icons: Record<string, string> = {};
        for (const item of items) {
          const match = allClubs.find(
            (c) =>
              c.csvColumn === item.club ||
              c.name === item.club
          );
          if (match) icons[item.club] = getIconUrl(match);
        }
        setIconMap(icons);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      {/* Fixed grass background + light green overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="/grass-bg.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 light-page-bg-overlay" />
      </div>

      <main className="relative z-10 max-w-[1200px] mx-auto px-4 py-8">
      <ModuleNavbar />

      <h1
        className="text-3xl font-bold tracking-tight text-center mb-8"
        style={{ color: "var(--text-primary)" }}
      >
        Índice de Transparência
      </h1>

      {error && (
        <p className="text-center py-8" style={{ color: "var(--brand-red)" }}>{error}</p>
      )}

      {!data && !error && (
        <p className="text-center py-8" style={{ color: "var(--text-secondary)" }}>Carregando...</p>
      )}

      {data && (
        <div className="space-y-12">
          <div className="card-surface mb-6">
            <TransparencyChart data={data} iconMap={iconMap} />
          </div>
          <div className="card-surface mb-6">
            <TransparencyTable data={data} iconMap={iconMap} />
          </div>
        </div>
      )}
      <ModuleNavbar />
    </main>
    </>
  );
}
