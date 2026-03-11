"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import Papa from "papaparse";
import { Club } from "@/lib/clubs";
import { metrics, categoryColors } from "@/lib/bar-chart-config";

interface HorizontalBarChartProps {
  club: Club;
}

interface BarDatum {
  label: string;
  val2024: number;
  val2023: number;
  category: string;
}

function formatBRL(v: number): string {
  return `R$ ${v.toFixed(0)} mi`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const sorted = [...payload].sort((a: any, b: any) => {
    if (a.dataKey === "val2024") return -1;
    if (b.dataKey === "val2024") return 1;
    return 0;
  });
  return (
    <div className="bg-white border border-gray-200 rounded shadow px-3 py-2 text-sm">
      <p className="font-semibold mb-1">{label}</p>
      {sorted.map((entry: any) => (
        <p key={entry.dataKey} style={{ color: entry.dataKey === "val2023" ? "#999" : entry.color }}>
          {entry.name}: {formatBRL(Number(entry.value))}
        </p>
      ))}
    </div>
  );
}

function CustomLegend({ payload }: any) {
  const items = [
    { label: "2024 (cor forte)", color: "#333" },
    { label: "2023 (cor leve)", color: "#aaa" },
  ];
  return (
    <div className="flex justify-center gap-6 mt-2 mb-2 text-sm">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              backgroundColor: item.color,
              borderRadius: 2,
            }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function HorizontalBarChart({ club }: HorizontalBarChartProps) {
  const [data, setData] = useState<BarDatum[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setData(null);

    fetch("/data/Painel_Consolidado_Moeda_Cte.csv")
      .then((res) => {
        if (!res.ok) throw new Error("Não foi possível carregar os dados CSV");
        return res.text();
      })
      .then((csvText) => {
        const parsed = Papa.parse(csvText, { header: false, skipEmptyLines: true });
        const rows = parsed.data as string[][];
        const header = rows[0];
        const colIdx = header.indexOf(club.csvColumn);

        if (colIdx === -1) {
          throw new Error(`Coluna "${club.csvColumn}" não encontrada no CSV`);
        }

        const barData: BarDatum[] = metrics.map((m) => ({
          label: m.label,
          val2024: parseFloat(rows[m.row2024 + 1]?.[colIdx] || "0") || 0,
          val2023: parseFloat(rows[m.row2023 + 1]?.[colIdx] || "0") || 0,
          category: m.category,
        }));

        setData(barData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [club]);

  if (loading) return <p className="text-center text-gray-500 py-8">Carregando gráfico de barras...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;
  if (!data) return null;

  return (
    <div>
      <div className="text-center mb-4">
        <p style={{ fontSize: 25, fontWeight: "bold" }}>{club.name}</p>
        <p style={{ fontSize: 20 }}>Comparativo 2024 vs 2023</p>
      </div>
      <CustomLegend />
      <ResponsiveContainer width="100%" height={data.length * 55 + 60}>
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 40, bottom: 10, left: 220 }}>
          <XAxis
            type="number"
            tickFormatter={(v: number) => formatBRL(v)}
            style={{ fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={210}
            tick={{ fontSize: 14, fontWeight: 500 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={0} stroke="#666" />
          <Bar dataKey="val2024" name="2024" barSize={18}>
            {data.map((d, i) => (
              <Cell key={`2024-${i}`} fill={categoryColors[d.category].dark} />
            ))}
          </Bar>
          <Bar dataKey="val2023" name="2023" barSize={18}>
            {data.map((d, i) => (
              <Cell key={`2023-${i}`} fill={categoryColors[d.category].light} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
