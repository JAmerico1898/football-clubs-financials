"use client";

import PlotlyChart from "./PlotlyChart";

interface RadarChartProps {
  data: { data: any[]; layout: Record<string, any> } | null;
  error: string | null;
  loading: boolean;
}

export default function RadarChart({ data, error, loading }: RadarChartProps) {
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
          }}
        />
      </div>
    </div>
  );
}
