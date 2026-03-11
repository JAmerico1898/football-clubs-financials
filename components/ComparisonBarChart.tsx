"use client";

import { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
} from "recharts";
import Papa from "papaparse";
import { Club, allChartClubs, extraChartClubs, getIconUrl } from "@/lib/clubs";
import { Metric, formatValue, formatAxisValue } from "@/lib/metric-config";

interface ComparisonBarChartProps {
  club: Club;
  metric: Metric;
}

interface BarDatum {
  name: string;
  value: number;
  isSelected: boolean;
  rank: number;
  iconUrl: string;
}

const ACCENT = "#1565C0";
const OTHER = "#90B4D4";

function ClubIconTick(props: Record<string, unknown> & { data: BarDatum[] }) {
  const { x: rawX, y: rawY, payload: rawPayload, data } = props;
  const x = Number(rawX);
  const y = Number(rawY);
  const payload = rawPayload as { value: string };
  const item = data.find((d) => d.name === payload.value);
  if (!item) return null;
  return (
    <g transform={`translate(${x},${y + 4})`}>
      <image
        href={item.iconUrl}
        x={-14}
        y={0}
        width={28}
        height={28}
      />
    </g>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: BarDatum }[];
  metric: Metric;
}

function CustomTooltip({ active, payload, metric }: CustomTooltipProps) {
  if (!active || !payload || !payload[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded shadow-md px-3 py-2 text-sm">
      <p className="font-bold mb-1">{d.name}</p>
      <p>{formatValue(d.value, metric.format)}</p>
      <p className="text-gray-500">Ranking: {d.rank}º</p>
    </div>
  );
}

export default function ComparisonBarChart({ club, metric }: ComparisonBarChartProps) {
  const [data, setData] = useState<BarDatum[]>([]);
  const [missingClubs, setMissingClubs] = useState<string[]>([]);

  useEffect(() => {
    fetch("/data/Índices.csv")
      .then((r) => r.text())
      .then((text) => {
        const clean = text.replace(/^\uFEFF/, "");
        const parsed = Papa.parse<string[]>(clean, { header: false });
        const rows = parsed.data;
        if (rows.length === 0) return;

        const header = rows[0];
        const metricRow = rows.find((row) => row[2]?.trim() === metric.csvKey);
        if (!metricRow) return;

        const extraNames = new Set(extraChartClubs.map((c) => c.name));
        const missing: string[] = [];
        const unsorted: Omit<BarDatum, "rank">[] = allChartClubs
          .map((c) => {
            const colIdx = header.findIndex((h) => h.trim() === c.csvColumn);
            const raw = colIdx >= 0 ? metricRow[colIdx]?.trim() : "";
            const value = parseFloat(raw);
            const isMissing =
              raw === "" || isNaN(value) || (extraNames.has(c.name) && value === 0);
            if (isMissing) {
              missing.push(c.name);
              return null;
            }
            return {
              name: c.name,
              value,
              isSelected: c.name === club.name,
              iconUrl: getIconUrl(c),
            };
          })
          .filter((item): item is Omit<BarDatum, "rank"> => item !== null);

        const sorted = [...unsorted].sort((a, b) =>
          metric.inverse ? a.value - b.value : b.value - a.value
        );

        const result: BarDatum[] = sorted.map((item, idx) => ({
          ...item,
          rank: idx + 1,
        }));

        setMissingClubs(missing);
        setData(result);
      });
  }, [club, metric]);

  // Compute Y-axis domain to accommodate negative values + padding for labels
  const yDomain = useMemo(() => {
    if (data.length === 0) return [0, "auto"] as [number, string];
    const values = data.map((d) => d.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || Math.abs(maxVal) || 1;

    // Add 15% padding on top for bar labels
    const yMax = maxVal + range * 0.15;

    if (minVal >= 0) {
      return [0, yMax];
    }

    // Add 10% padding below for negative values so icons don't overlap
    const yMin = minVal - range * 0.10;
    return [yMin, yMax];
  }, [data]);

  const hasNegatives = useMemo(
    () => data.some((d) => d.value < 0),
    [data]
  );

  if (data.length === 0) return null;

  return (
    <div>
      <h2 className="text-[25px] font-bold text-center mb-2">{metric.label}</h2>
      <p className="text-center text-gray-500 text-sm mb-4">Comparativo 2024</p>
      <ResponsiveContainer width="100%" height={520}>
        <BarChart data={data} margin={{ top: 30, right: 20, left: 20, bottom: 50 }}>
          <XAxis
            dataKey="name"
            interval={0}
            tick={(props) => (
              <ClubIconTick {...(props as Record<string, unknown>)} data={data} />
            )}
            height={50}
          />
          <YAxis
            domain={yDomain}
            tickFormatter={(v) => formatAxisValue(v, metric.format)}
            tick={{ fontSize: 13 }}
            width={80}
          />
          {hasNegatives && <ReferenceLine y={0} stroke="#999" strokeWidth={1} />}
          <Tooltip
            content={(props) => (
              <CustomTooltip
                active={props.active}
                payload={props.payload as unknown as { payload: BarDatum }[]}
                metric={metric}
              />
            )}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            <LabelList
              dataKey="value"
              position="top"
              formatter={(v) => formatValue(Number(v), metric.format)}
              style={{ fontSize: 12, fill: "#444", fontWeight: 500 }}
            />
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.isSelected ? ACCENT : OTHER} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {missingClubs.length > 0 && (
        <div className="-mt-6 ml-[100px] space-y-0.5">
          {missingClubs.map((name) => (
            <p key={name} className="text-gray-500 text-xs italic">
              {name} não reportou esse dado em suas Demonstrações Financeiras publicadas.
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
