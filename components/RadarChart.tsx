"use client";

import PlotlyChart from "./PlotlyChart";
import { useThemeColors } from "@/lib/useThemeColors";

interface RadarChartProps {
  data: { data: any[]; layout: Record<string, any> } | null;
  error: string | null;
  loading: boolean;
}

export default function RadarChart({ data, error, loading }: RadarChartProps) {
  const colors = useThemeColors();

  if (loading) return <p className="text-center text-gray-500 py-8">Carregando gráfico radar...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;
  if (!data) return null;

  return (
    <div style={{ minHeight: 500, overflowX: "auto" }}>
      <div style={{ width: 870, margin: "0 auto" }}>
        <PlotlyChart
          data={data.data}
          layout={{
            ...data.layout,
            width: 870,
            height: 870,
            paper_bgcolor: "transparent",
            plot_bgcolor: "transparent",
            font: {
              family: "Inter, system-ui, sans-serif",
              color: colors.textPrimary,
            },
            colorway: [colors.brandBlue, colors.brandRed, colors.brandGreen, colors.brandGold],
          }}
        />
      </div>
    </div>
  );
}
