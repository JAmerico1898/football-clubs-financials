"use client";

import PlotlyChart from "./PlotlyChart";
import { useThemeColors } from "@/lib/useThemeColors";

interface SankeyChartProps {
  clubName: string;
  data: { data: any[]; layout: Record<string, any> } | null;
  error: string | null;
  loading: boolean;
}

export default function SankeyChart({ clubName, data, error, loading }: SankeyChartProps) {
  const colors = useThemeColors();

  if (loading) return <p className="text-center text-gray-500 py-8">Carregando diagrama Sankey...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;
  if (!data) return null;

  return (
    <div>
      <div className="text-center mb-2">
        <p style={{ fontSize: 25, fontWeight: "bold" }}>{clubName}</p>
        <p style={{ fontSize: 20 }}>Demonstração de Resultado</p>
      </div>
      <div>
        <PlotlyChart
          data={data.data}
          layout={{
            ...data.layout,
            autosize: true,
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
