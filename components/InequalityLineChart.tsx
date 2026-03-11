"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export interface LineConfig {
  dataKey: string;
  label: string;
  color: string;
  /** ISO 3166-1 alpha-2 country code (e.g. "br", "gb") */
  countryCode: string;
}

interface InequalityLineChartProps {
  title: string;
  yAxisLabel: string;
  data: Record<string, string | number | null>[];
  lines: LineConfig[];
  formatDecimals: number;
  footnote?: string;
}

function FlagImg({ code, size = 18 }: { code: string; size?: number }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={code.toUpperCase()}
      width={size}
      height={Math.round(size * 0.75)}
      style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }}
    />
  );
}

interface TooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string;
  lines: LineConfig[];
  formatDecimals: number;
}

function CustomTooltip({ active, payload, label, lines, formatDecimals }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded shadow-md px-3 py-2 text-xs">
      <p className="font-bold mb-1 text-sm">{label}</p>
      {payload.map((p) => {
        if (p.value == null) return null;
        const cfg = lines.find((l) => l.dataKey === p.dataKey);
        if (!cfg) return null;
        return (
          <p key={p.dataKey} style={{ color: cfg.color }} className="flex items-center gap-1">
            <FlagImg code={cfg.countryCode} size={16} />
            {cfg.label}: {Number(p.value).toFixed(formatDecimals)}
          </p>
        );
      })}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderLegend(props: any, lines: LineConfig[]) {
  const { payload } = props;
  if (!payload) return null;
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((entry: any) => {
        const cfg = lines.find((l) => l.dataKey === entry.dataKey);
        if (!cfg) return null;
        return (
          <span key={entry.dataKey} style={{ color: cfg.color }} className="font-medium inline-flex items-center gap-1">
            <FlagImg code={cfg.countryCode} />
            {cfg.label}
          </span>
        );
      })}
    </div>
  );
}

export default function InequalityLineChart({
  title,
  yAxisLabel,
  data,
  lines,
  formatDecimals,
  footnote,
}: InequalityLineChartProps) {
  return (
    <div>
      <h3 className="text-lg font-bold text-center mb-3">{title}</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
          <XAxis dataKey="season" tick={{ fontSize: 12 }} />
          <YAxis
            label={{
              value: yAxisLabel,
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 16, fontWeight: 600, textAnchor: "middle" },
            }}
            tick={{ fontSize: 12 }}
            width={70}
            tickFormatter={(v) =>
              formatDecimals <= 2
                ? Math.round(Number(v)).toString()
                : Number(v).toFixed(2)
            }
          />
          <Tooltip
            content={(props) => (
              <CustomTooltip
                active={props.active}
                payload={props.payload as TooltipProps["payload"]}
                label={props.label as string}
                lines={lines}
                formatDecimals={formatDecimals}
              />
            )}
          />
          <Legend content={(props) => renderLegend(props, lines)} />
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.color}
              strokeWidth={2.5}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {footnote && (
        <div className="text-center text-gray-400 text-xs italic mt-1">
          {footnote.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
