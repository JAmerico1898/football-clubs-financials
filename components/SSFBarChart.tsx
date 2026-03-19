"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  ReferenceLine,
  LabelList,
} from "recharts";
import type { SSFBarDatum } from "@/hooks/useSSFData";

const GREEN = "#2E7D32";
const RED = "#C0392B";

interface ReferenceLineConfig {
  y: number;
  color: string;
  label: string;
}

interface SSFBarChartProps {
  data: SSFBarDatum[];
  selectedClub: string;
  title: string;
  concept: string;
  yLabel: string;
  formatFn: (v: number) => string;
  tooltipFormatFn?: (v: number) => string;
  referenceLines?: ReferenceLineConfig[];
  dashedZeroLine?: boolean;
  disclaimer?: string;
}

function ClubIconTick(
  props: Record<string, unknown> & { data: SSFBarDatum[] }
) {
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
        x={-16}
        y={0}
        width={33}
        height={33}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: SSFBarDatum }[];
  formatFn: (v: number) => string;
}

function CustomTooltip({ active, payload, formatFn }: CustomTooltipProps) {
  if (!active || !payload || !payload[0]) return null;
  const d = payload[0].payload;
  return (
    <div
      className="rounded shadow-md px-3 py-2 text-sm"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        color: "var(--text-primary)",
      }}
    >
      <p className="font-bold mb-1">{d.name}</p>
      <p>{formatFn(d.value)}</p>
    </div>
  );
}

export default function SSFBarChart({
  data,
  selectedClub,
  title,
  concept,
  yLabel,
  formatFn,
  tooltipFormatFn,
  referenceLines,
  dashedZeroLine,
  disclaimer,
}: SSFBarChartProps) {
  const compliantCount = useMemo(
    () => data.filter((d) => d.compliant).length,
    [data]
  );

  const yDomain = useMemo(() => {
    if (data.length === 0) return [0, "auto"] as [number, string];
    const values = data.map((d) => d.value);
    const refValues = referenceLines?.map((r) => r.y) ?? [];
    const allValues = [...values, ...refValues];
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    const range = maxVal - minVal || Math.abs(maxVal) || 1;
    const yMax = maxVal + range * 0.12;
    if (minVal >= 0) return [0, yMax];
    const yMin = minVal - range * 0.1;
    return [yMin, yMax];
  }, [data, referenceLines]);

  if (data.length === 0) return null;

  return (
    <div>
      <h2
        className="text-[22px] font-bold text-center mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h2>
      <p
        className="text-sm text-center mb-1 max-w-[900px] mx-auto"
        style={{ color: "var(--text-secondary)" }}
      >
        {concept}
      </p>
      <p
        className="text-sm text-center mb-4 italic"
        style={{ color: "var(--text-secondary)" }}
      >
        {compliantCount} de {data.length} clubes conformes
      </p>
      <div className="overflow-x-auto">
        <div style={{ minWidth: 900 }}>
          <ResponsiveContainer width="100%" height={520}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 20, left: 20, bottom: 50 }}
            >
              <XAxis
                dataKey="name"
                interval={0}
                tick={(props) => (
                  <ClubIconTick
                    {...(props as Record<string, unknown>)}
                    data={data}
                  />
                )}
                height={64}
              />
              <YAxis
                domain={yDomain}
                tickFormatter={(v) => formatFn(v)}
                tick={{ fill: "var(--text-secondary)", fontSize: 13 }}
                width={90}
                label={{
                  value: yLabel,
                  angle: -90,
                  position: "insideLeft",
                  style: {
                    fill: "var(--text-secondary)",
                    fontSize: 12,
                    textAnchor: "middle",
                  },
                  offset: -10,
                }}
              />
              {dashedZeroLine && (
                <ReferenceLine
                  y={0}
                  stroke="#555"
                  strokeWidth={1}
                  strokeDasharray="6 3"
                />
              )}
              {referenceLines?.map((rl) => (
                <ReferenceLine
                  key={rl.label}
                  y={rl.y}
                  stroke={rl.color}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
              ))}
              <Tooltip
                content={(props) => (
                  <CustomTooltip
                    active={props.active}
                    payload={
                      props.payload as unknown as { payload: SSFBarDatum }[]
                    }
                    formatFn={tooltipFormatFn ?? formatFn}
                  />
                )}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="value"
                  content={(props) => {
                    const { x, y, width, value, index } = props as unknown as {
                      x: number; y: number; width: number; value: number; index: number;
                    };
                    const numVal = Number(value);
                    const isNeg = numVal < 0;
                    return (
                      <text
                        key={index}
                        x={x + width / 2}
                        y={isNeg ? y + 14 : y - 4}
                        textAnchor="middle"
                        fontSize={10}
                        fill="#444"
                        fontWeight={500}
                      >
                        {formatFn(numVal)}
                      </text>
                    );
                  }}
                />
                {data.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={entry.compliant ? GREEN : RED}
                    stroke={entry.name === selectedClub ? "#333" : "none"}
                    strokeWidth={entry.name === selectedClub ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {referenceLines && referenceLines.length > 0 && (
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-2">
          {referenceLines.map((rl) => (
            <span key={rl.label} className="flex items-center gap-1.5 text-xs font-semibold">
              <span
                style={{
                  display: "inline-block",
                  width: 20,
                  height: 0,
                  borderTop: `2px dashed ${rl.color}`,
                }}
              />
              <span style={{ color: rl.color }}>{rl.label}</span>
            </span>
          ))}
        </div>
      )}
      {disclaimer && (
        <p
          className="text-xs italic mt-2 ml-[100px]"
          style={{ color: "var(--text-secondary)" }}
        >
          {disclaimer}
        </p>
      )}
    </div>
  );
}
