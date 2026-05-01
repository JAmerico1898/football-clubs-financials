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
import { useThemeColors } from "@/lib/useThemeColors";

export interface TransparencyDatum {
  club: string;
  nivel1: number;
  nivel2: number;
  nivel3: number;
  total: number;
  /** Total a ser exibido como rótulo somente na barra cuja chave é o topo do empilhamento. As demais ficam undefined. */
  labelOnNivel1?: number;
  labelOnNivel2?: number;
  labelOnNivel3?: number;
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
    <div className="rounded shadow px-3 py-2 text-sm" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
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
  const size = 30;
  return (
    <g transform={`translate(${x},${y})`}>
      <image
        href={iconUrl}
        x={-size / 2}
        y={4}
        width={size}
        height={size}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
}

function withTopLabels(items: TransparencyDatum[]): TransparencyDatum[] {
  return items.map((d) => {
    const out: TransparencyDatum = { ...d };
    if (d.total <= 0) return out;
    if (d.nivel3 > 0) out.labelOnNivel3 = d.total;
    else if (d.nivel2 > 0) out.labelOnNivel2 = d.total;
    else if (d.nivel1 > 0) out.labelOnNivel1 = d.total;
    return out;
  });
}

export default function TransparencyChart({ data, iconMap }: Props) {
  const colors = useThemeColors();
  const dataWithLabels = withTopLabels(data);

  return (
    <div>
      <h2 className="text-lg font-bold text-center mb-4">
        Índice de Transparência das Demonstrações Financeiras — 2025
      </h2>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={dataWithLabels}
          margin={{ top: 45, right: 30, bottom: 50, left: 20 }}
        >
          <XAxis
            dataKey="club"
            interval={0}
            tick={(props: any) => <ClubBadgeTick {...props} iconMap={iconMap} />}
            height={56}
          />
          <YAxis
            label={{
              value: "Pontuação",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 18, fontWeight: "bold", fill: colors.textPrimary },
            }}
            tick={{ fill: colors.textSecondary }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 30 }} />
          <Bar
            dataKey="nivel1"
            name="Nível 1 – Reportes Obrigatórios"
            stackId="a"
            fill={COLORS.nivel1}
          >
            <LabelList
              dataKey="labelOnNivel1"
              position="top"
              offset={6}
              formatter={(v: any) =>
                typeof v === "number" ? v.toFixed(1) : ""
              }
              fill={colors.textPrimary}
              fontSize={11}
              fontWeight="bold"
            />
          </Bar>
          <Bar
            dataKey="nivel2"
            name="Nível 2 – Reportes Discricionários"
            stackId="a"
            fill={COLORS.nivel2}
          >
            <LabelList
              dataKey="labelOnNivel2"
              position="top"
              offset={6}
              formatter={(v: any) =>
                typeof v === "number" ? v.toFixed(1) : ""
              }
              fill={colors.textPrimary}
              fontSize={11}
              fontWeight="bold"
            />
          </Bar>
          <Bar
            dataKey="nivel3"
            name="Nível 3 – Indicadores de Qualidade"
            stackId="a"
            fill={COLORS.nivel3}
          >
            <LabelList
              dataKey="labelOnNivel3"
              position="top"
              offset={6}
              formatter={(v: any) =>
                typeof v === "number" ? v.toFixed(1) : ""
              }
              fill={colors.textPrimary}
              fontSize={11}
              fontWeight="bold"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
