"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export interface TransparencyDatum {
  club: string;
  nivel1: number;
  nivel2: number;
  nivel3: number;
  total: number;
}

interface Props {
  data: TransparencyDatum[];
  iconMap: Record<string, string>;
}

const COLORS = {
  nivel1: "#1565C0",
  nivel2: "#42A5F5",
  nivel3: "#90CAF9",
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const total = payload.reduce((s: number, p: any) => s + Number(p.value), 0);
  return (
    <div className="bg-white border border-gray-200 rounded shadow px-3 py-2 text-sm">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}: {Number(entry.value).toFixed(1)}
        </p>
      ))}
      <p className="font-semibold mt-1 border-t pt-1">
        Total: {total.toFixed(1)}
      </p>
    </div>
  );
}

function ClubBadgeTick({ x, y, payload, iconMap }: any) {
  const iconUrl = iconMap[payload.value];
  if (!iconUrl) return null;
  const size = 28;
  return (
    <g transform={`translate(${x},${y})`}>
      <image
        href={iconUrl}
        x={-size / 2}
        y={4}
        width={size}
        height={size}
      />
    </g>
  );
}

function renderTopLabel(props: any) {
  const { x, y, width, index, data } = props;
  if (!data || !data[index]) return null;
  const total = data[index].total;
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      textAnchor="middle"
      fontSize={11}
      fontWeight="bold"
      fill="#333"
    >
      {total.toFixed(1)}
    </text>
  );
}

export default function TransparencyChart({ data, iconMap }: Props) {
  return (
    <div>
      <h2 className="text-lg font-bold text-center mb-4">
        Índice de Transparência das Demonstrações Financeiras — 2024
      </h2>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={data}
          margin={{ top: 45, right: 30, bottom: 50, left: 20 }}
        >
          <XAxis
            dataKey="club"
            interval={0}
            tick={(props: any) => <ClubBadgeTick {...props} iconMap={iconMap} />}
            height={50}
          />
          <YAxis
            label={{
              value: "Pontuação",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 18, fontWeight: "bold" },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 30 }} />
          <Bar
            dataKey="nivel1"
            name="Nível 1 – Reportes Obrigatórios"
            stackId="a"
            fill={COLORS.nivel1}
          />
          <Bar
            dataKey="nivel2"
            name="Nível 2 – Reportes Discricionários"
            stackId="a"
            fill={COLORS.nivel2}
          />
          <Bar
            dataKey="nivel3"
            name="Nível 3 – Indicadores de Qualidade"
            stackId="a"
            fill={COLORS.nivel3}
          >
            <LabelList
              content={(props: any) => renderTopLabel({ ...props, data })}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
