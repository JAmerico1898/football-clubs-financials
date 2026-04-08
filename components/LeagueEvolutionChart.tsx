"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { METRIC_COLORS } from "@/lib/evolucao-liga-constants";

interface LeagueEvolutionChartProps {
  data: Array<{ year: number; [metric: string]: number }>;
  selectedMetrics: string[];
}

function CustomTooltip({
  active,
  payload,
  label,
  fullData,
}: {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string | number;
  fullData: Array<{ year: number; [metric: string]: number }>;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const currentYear = Number(label);
  const prevRow = fullData.find((d) => d.year === currentYear - 1);

  return (
    <div
      className="rounded shadow-md px-3 py-2 text-xs"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        color: "var(--text-primary)",
      }}
    >
      <p className="font-bold mb-1 text-sm">{label}</p>
      {payload.map((p) => {
        if (p.value == null) return null;
        const formatted = `R$\u00A0${Number(p.value).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;

        const prevVal = prevRow?.[p.dataKey as string];
        let yoyLabel = "";
        let yoyColor = "";
        if (prevVal != null && prevVal !== 0) {
          const pctChange = ((Number(p.value) - Number(prevVal)) / Math.abs(Number(prevVal))) * 100;
          const sign = pctChange > 0 ? "+" : "";
          const arrow = pctChange > 0 ? "▲" : pctChange < 0 ? "▼" : "";
          yoyLabel = ` ${arrow} ${sign}${pctChange.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
          yoyColor = pctChange > 0 ? "#2E7D32" : pctChange < 0 ? "#C62828" : "var(--text-secondary)";
        }

        return (
          <p key={p.dataKey} className="py-0.5">
            <span style={{ color: p.color }}>{p.name}: {formatted}</span>
            {yoyLabel && (
              <span style={{ color: yoyColor, fontWeight: 600 }}>{yoyLabel}</span>
            )}
          </p>
        );
      })}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderLegend(props: any) {
  const { payload } = props;
  if (!payload) return null;
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((entry: any) => (
        <span
          key={entry.dataKey}
          className="inline-flex items-center gap-1.5 font-medium"
          style={{ color: entry.color }}
        >
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {entry.value}
        </span>
      ))}
    </div>
  );
}

export default function LeagueEvolutionChart({
  data,
  selectedMetrics,
}: LeagueEvolutionChartProps) {
  if (selectedMetrics.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-[420px] text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        Selecione variáveis para visualizar o gráfico.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={420}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, bottom: 10, left: 60 }}
      >
        <XAxis
          dataKey="year"
          type="number"
          domain={[2021, 2025]}
          ticks={[2021, 2022, 2023, 2024, 2025]}
          tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
          tickFormatter={(v) => String(v)}
        />
        <YAxis
          domain={["auto", "auto"]}
          label={{
            value: "R$ milhões",
            angle: -90,
            position: "insideLeft",
            style: {
              fontSize: 14,
              fontWeight: 600,
              textAnchor: "middle",
              fill: "var(--text-secondary)",
            },
          }}
          tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
          width={70}
          tickFormatter={(v) =>
            Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 })
          }
        />
        <Tooltip
          content={(props) => (
            <CustomTooltip
              active={props.active}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              payload={props.payload as any[]}
              label={props.label}
              fullData={data}
            />
          )}
        />
        <Legend content={renderLegend} />
        {selectedMetrics.map((metric) => (
          <Line
            key={metric}
            type="monotone"
            dataKey={metric}
            name={metric}
            stroke={METRIC_COLORS[metric]}
            strokeWidth={2}
            dot={{ r: 4, fill: METRIC_COLORS[metric] }}
            activeDot={{ r: 6 }}
            connectNulls={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
