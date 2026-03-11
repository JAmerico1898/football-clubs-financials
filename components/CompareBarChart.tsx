"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import Papa from "papaparse";
import { Club } from "@/lib/clubs";
import { compareMetrics } from "@/lib/compare-chart-config";
import { categoryColors } from "@/lib/bar-chart-config";
import { resolveClubColors } from "@/lib/clubColors";

interface CompareBarChartProps {
  club1: Club;
  club2: Club;
}

interface BarDatum {
  label: string;
  valClub1: number;
  valClub2: number;
  category: string;
}

function formatBRL(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1000) {
    const bi = v / 1000;
    return `R$ ${bi.toFixed(1).replace(".", ",")} bi`;
  }
  return `R$ ${v.toFixed(0)} mi`;
}

function CustomTooltip({
  active,
  payload,
  label,
  club1Name,
  club2Name,
}: any) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white border border-gray-200 rounded shadow px-3 py-2 text-sm">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} style={{ color: entry.fill || entry.color }}>
          {entry.dataKey === "valClub1" ? club1Name : club2Name}:{" "}
          {formatBRL(Number(entry.value))}
        </p>
      ))}
    </div>
  );
}

export default function CompareBarChart({ club1, club2 }: CompareBarChartProps) {
  const [data, setData] = useState<BarDatum[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { color1, color2 } = resolveClubColors(club1.name, club2.name);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setData(null);

    fetch("/data/Índices.csv")
      .then((res) => {
        if (!res.ok) throw new Error("Não foi possível carregar os dados CSV");
        return res.text();
      })
      .then((csvText) => {
        const clean = csvText.replace(/^\uFEFF/, "");
        const parsed = Papa.parse(clean, { header: false, skipEmptyLines: true });
        const rows = parsed.data as string[][];
        const header = rows[0];

        const col1 = header.findIndex(
          (h) => h.trim() === club1.csvColumn,
        );
        const col2 = header.findIndex(
          (h) => h.trim() === club2.csvColumn,
        );

        if (col1 === -1) throw new Error(`Coluna "${club1.csvColumn}" não encontrada`);
        if (col2 === -1) throw new Error(`Coluna "${club2.csvColumn}" não encontrada`);

        const barData: BarDatum[] = compareMetrics.map((m) => {
          const row = rows.find(
            (r) => r[2]?.trim() === m.csvKey && r[0]?.trim() === "2024",
          );
          return {
            label: m.label,
            valClub1: parseFloat(row?.[col1] || "0") || 0,
            valClub2: parseFloat(row?.[col2] || "0") || 0,
            category: m.category,
          };
        });

        setData(barData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [club1, club2]);

  if (loading)
    return (
      <p className="text-center text-gray-500 py-8">
        Carregando gráfico de barras...
      </p>
    );
  if (error)
    return <p className="text-center text-red-500 py-8">{error}</p>;
  if (!data) return null;

  // Build category separator ticks
  const categoryOrder = ["receita", "despesa", "resultado", "passivo"] as const;
  const categoryLabels: Record<string, string> = {
    receita: "RECEITA",
    despesa: "DESPESA/INVESTIMENTO",
    resultado: "RESULTADO",
    passivo: "PASSIVO",
  };

  // Insert category separators
  type DisplayItem = BarDatum | { label: string; separator: true; category: string };
  const displayData: DisplayItem[] = [];
  let lastCat = "";
  for (const d of data) {
    if (d.category !== lastCat) {
      displayData.push({
        label: `__sep__${d.category}`,
        separator: true,
        category: d.category,
      });
      lastCat = d.category;
    }
    displayData.push(d);
  }

  // Custom Y-axis tick that renders category headers
  const CustomYTick = (props: any) => {
    const { x, y, payload } = props;
    const value: string = payload.value;
    if (value.startsWith("__sep__")) {
      const cat = value.replace("__sep__", "");
      const catColor = categoryColors[cat]?.dark ?? "#333";
      return (
        <text
          x={x - 4}
          y={y}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize={13}
          fontWeight={700}
          fill={catColor}
        >
          {categoryLabels[cat]}
        </text>
      );
    }
    return (
      <text
        x={x - 4}
        y={y}
        textAnchor="end"
        dominantBaseline="middle"
        fontSize={13}
        fontWeight={500}
        fill="#333"
      >
        {value}
      </text>
    );
  };

  return (
    <div>
      <div className="text-center mb-4">
        <p style={{ fontSize: 25, fontWeight: "bold" }}>
          {club1.name} vs. {club2.name}
        </p>
        <p style={{ fontSize: 16 }}>(em R$ milhões)</p>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-2 mb-2 text-sm">
        <div className="flex items-center gap-2">
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              backgroundColor: color1,
              borderRadius: 2,
            }}
          />
          <span>{club1.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              backgroundColor: color2,
              borderRadius: 2,
            }}
          />
          <span>{club2.name}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={displayData.length * 40 + 60}>
        <BarChart
          data={displayData}
          layout="vertical"
          margin={{ top: 10, right: 40, bottom: 10, left: 220 }}
        >
          <XAxis
            type="number"
            tickFormatter={(v: number) => formatBRL(v)}
            style={{ fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={210}
            tick={<CustomYTick />}
          />
          <Tooltip
            content={
              <CustomTooltip
                club1Name={club1.name}
                club2Name={club2.name}
              />
            }
          />
          <ReferenceLine x={0} stroke="#666" />
          <Bar dataKey="valClub1" name={club1.name} barSize={16}>
            {displayData.map((d, i) => (
              <Cell
                key={`c1-${i}`}
                fill={"separator" in d ? "transparent" : color1}
              />
            ))}
          </Bar>
          <Bar dataKey="valClub2" name={club2.name} barSize={16}>
            {displayData.map((d, i) => (
              <Cell
                key={`c2-${i}`}
                fill={"separator" in d ? "transparent" : color2}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
