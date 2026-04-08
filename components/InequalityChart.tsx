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
import { CATEGORY_COLORS } from "@/lib/desigualdade-constants";

interface InequalityChartProps {
  title: string;
  yAxisLabel: string;
  yDomain: [number, number] | "auto";
  yTickDecimals: number;
  data: Array<Record<string, number>>;
  visibleCategories: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({
  active,
  payload,
  label,
  decimals,
}: {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string | number;
  decimals: number;
}) {
  if (!active || !payload || payload.length === 0) return null;

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
        return (
          <p key={p.dataKey} style={{ color: p.color }} className="py-0.5">
            {p.name}: {Number(p.value).toFixed(decimals)}
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

export default function InequalityChart({
  title,
  yAxisLabel,
  yDomain,
  yTickDecimals,
  data,
  visibleCategories,
}: InequalityChartProps) {
  if (visibleCategories.length === 0) {
    return (
      <div>
        <h3
          className="text-lg font-bold text-center mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>
        <div
          className="flex items-center justify-center h-[350px] text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Selecione variáveis para visualizar o gráfico.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3
        className="text-lg font-bold text-center mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
        >
          <XAxis
            dataKey="year"
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
          />
          <YAxis
            domain={yDomain === "auto" ? undefined : yDomain}
            label={{
              value: yAxisLabel,
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
            tickFormatter={(v) => Number(v).toFixed(yTickDecimals)}
          />
          <Tooltip
            content={(props) => (
              <CustomTooltip
                active={props.active}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                payload={props.payload as any[]}
                label={props.label}
                decimals={yTickDecimals}
              />
            )}
          />
          <Legend content={renderLegend} />
          {visibleCategories.map((cat) => (
            <Line
              key={cat}
              type="monotone"
              dataKey={cat}
              name={cat}
              stroke={CATEGORY_COLORS[cat]}
              strokeWidth={2.5}
              dot={{ r: 4, fill: CATEGORY_COLORS[cat] }}
              activeDot={{ r: 6 }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
