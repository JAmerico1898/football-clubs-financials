"use client";

import dynamic from "next/dynamic";
import { useThemeColors } from "@/lib/useThemeColors";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface PlotlyChartProps {
  data: any[];
  layout?: Record<string, any>;
}

export default function PlotlyChart({ data, layout }: PlotlyChartProps) {
  const colors = useThemeColors();

  return (
    <Plot
      data={data}
      layout={{
        autosize: true,
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        font: {
          family: "Inter, system-ui, sans-serif",
          color: colors.textPrimary,
        },
        ...layout,
      }}
      config={{ responsive: true, displayModeBar: false }}
      useResizeHandler
      style={{ width: "100%" }}
    />
  );
}
