"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface PlotlyChartProps {
  data: any[];
  layout?: Record<string, any>;
}

export default function PlotlyChart({ data, layout }: PlotlyChartProps) {
  return (
    <Plot
      data={data}
      layout={{
        autosize: true,
        ...layout,
      }}
      config={{ responsive: true, displayModeBar: false }}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
    />
  );
}
