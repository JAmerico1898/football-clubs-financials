"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import BackButton from "@/components/BackButton";
import TransparencyChart, {
  TransparencyDatum,
} from "@/components/TransparencyChart";
import TransparencyTable from "@/components/TransparencyTable";
import { clubs, getIconUrl } from "@/lib/clubs";

export default function IndiceDeTransparencia() {
  const [data, setData] = useState<TransparencyDatum[] | null>(null);
  const [iconMap, setIconMap] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/Transparencia.csv")
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

        if (rows.length < 5) throw new Error("CSV com formato inesperado");

        const clubNames = rows[0];
        const items: TransparencyDatum[] = [];

        for (let i = 1; i < clubNames.length; i++) {
          items.push({
            club: clubNames[i].trim(),
            nivel1: parseFloat(rows[1][i]) || 0,
            nivel2: parseFloat(rows[2][i]) || 0,
            nivel3: parseFloat(rows[3][i]) || 0,
            total: parseFloat(rows[4][i]) || 0,
          });
        }

        items.sort((a, b) => b.total - a.total);
        setData(items);

        const icons: Record<string, string> = {};
        for (const item of items) {
          const match = clubs.find(
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
    <main className="max-w-[1200px] mx-auto px-4 py-8">
      <BackButton />

      <h1 className="text-2xl font-bold text-center mb-8">
        Índice de Transparência
      </h1>

      {error && (
        <p className="text-center text-red-500 py-8">{error}</p>
      )}

      {!data && !error && (
        <p className="text-center text-gray-500 py-8">Carregando...</p>
      )}

      {data && (
        <div className="space-y-12">
          <TransparencyChart data={data} iconMap={iconMap} />
          <TransparencyTable data={data} iconMap={iconMap} />
        </div>
      )}
    </main>
  );
}
