"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Papa from "papaparse";
import { Club, clubs } from "@/lib/clubs";
import { Metric, hasHistoricalData, formatValue, formatAxisValue } from "@/lib/metric-config";

interface EvolutionLineChartProps {
  club: Club;
  metric: Metric;
}

const ACCENT = "#1565C0";
const GRAY = "#CCCCCC";
const YEARS = ["2021", "2022", "2023", "2024"];

interface LineTooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string;
  metric: Metric;
  selectedClub: string;
}

function LineCustomTooltip({ active, payload, label, metric, selectedClub }: LineTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const entries = payload
    .filter((p: { dataKey?: string; value?: number }) => p.dataKey && p.value != null)
    .map((p: { dataKey: string; value: number }) => ({
      name: String(p.dataKey),
      value: Number(p.value),
    }));

  entries.sort((a: { value: number }, b: { value: number }) =>
    metric.inverse ? a.value - b.value : b.value - a.value
  );

  return (
    <div className="bg-white border border-gray-200 rounded shadow-md px-3 py-2 text-xs max-h-[400px] overflow-y-auto">
      <p className="font-bold mb-1 text-sm">{label}</p>
      {entries.map((entry: { name: string; value: number }, idx: number) => {
        const isSelected = entry.name === selectedClub;
        return (
          <p
            key={entry.name}
            style={{ fontWeight: isSelected ? 700 : 400, color: isSelected ? ACCENT : "#555" }}
          >
            {idx + 1}. {entry.name}: {formatValue(entry.value, metric.format)}
          </p>
        );
      })}
    </div>
  );
}

export default function EvolutionLineChart({ club, metric }: EvolutionLineChartProps) {
  const [data, setData] = useState<Record<string, string | number>[]>([]);
  const hasHistory = hasHistoricalData(metric);

  useEffect(() => {
    if (!hasHistory) return;

    fetch("/data/Painel_Consolidado_Moeda_Cte.csv")
      .then((r) => r.text())
      .then((text) => {
        const clean = text.replace(/^\uFEFF/, "");
        const parsed = Papa.parse<string[]>(clean, { header: false });
        const rows = parsed.data;
        if (rows.length === 0) return;

        const header = rows[0];

        const chartData = YEARS.map((year) => {
          const row = rows.find(
            (r) => r[0]?.trim() === year && r[2]?.trim() === metric.csvKey
          );
          const point: Record<string, string | number> = { year };
          clubs.forEach((c) => {
            const colIdx = header.findIndex((h) => h.trim() === c.csvColumn);
            const raw = row && colIdx >= 0 ? row[colIdx] : "";
            point[c.name] = parseFloat(raw) || 0;
          });
          return point;
        });

        setData(chartData);
      });
  }, [metric, hasHistory]);

  if (!hasHistory) {
    return (
      <div className="text-center py-12">
        <h2 className="text-[25px] font-bold mb-4">{metric.label}</h2>
        <p className="text-gray-500 italic">
          Dados históricos não disponíveis para esta métrica
        </p>
      </div>
    );
  }

  if (data.length === 0) return null;

  return (
    <div>
      <h2 className="text-[25px] font-bold text-center mb-1">
        {metric.label} (2021-2024)
      </h2>
      <p className="text-center text-gray-500 text-sm italic mb-4">
        Valores em moeda constante (IPCA)
      </p>
      <ResponsiveContainer width="100%" height={450}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
          <XAxis dataKey="year" />
          <YAxis
            tickFormatter={(v) => formatAxisValue(v, metric.format)}
            tick={{ fontSize: 13 }}
            width={80}
          />
          <Tooltip
            content={
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (props: any) => (
                <LineCustomTooltip
                  active={props.active}
                  payload={props.payload}
                  label={props.label}
                  metric={metric}
                  selectedClub={club.name}
                />
              )
            }
          />
          {clubs.map((c) => (
            <Line
              key={c.name}
              type="monotone"
              dataKey={c.name}
              stroke={c.name === club.name ? ACCENT : GRAY}
              strokeWidth={c.name === club.name ? 3 : 1}
              opacity={c.name === club.name ? 1 : 0.4}
              dot={c.name === club.name}
              activeDot={c.name === club.name ? { r: 6 } : undefined}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
