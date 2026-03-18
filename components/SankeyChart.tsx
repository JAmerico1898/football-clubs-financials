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

  if (loading) return <p className="text-center py-8" style={{ color: "var(--text-secondary)" }}>Carregando diagrama Sankey...</p>;
  if (error) return <p className="text-center py-8" style={{ color: "var(--brand-red)" }}>{error}</p>;
  if (!data) return null;

  return (
    <div>
      <div className="text-center mb-4">
        <p style={{ fontSize: 25, fontWeight: "bold", color: "var(--text-primary)" }}>{clubName}</p>
        <p style={{ fontSize: 20, color: "var(--text-secondary)" }}>Demonstração de Resultado</p>
      </div>
      <div style={{ height: 600, position: "relative" }}>
        <PlotlyChart
          data={data.data}
          layout={{
            ...data.layout,
            height: 600,
            margin: { t: 40, b: 20, l: 0, r: 0, ...data.layout.margin },
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
