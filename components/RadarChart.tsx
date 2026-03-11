"use client";

import { useEffect, useState } from "react";
import { Club, getRadarUrl } from "@/lib/clubs";
import PlotlyChart from "./PlotlyChart";

interface RadarChartProps {
  club: Club;
}

export default function RadarChart({ club }: RadarChartProps) {
  const [plotData, setPlotData] = useState<{ data: any[]; layout: Record<string, any> } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setPlotData(null);

    fetch(getRadarUrl(club))
      .then((res) => {
        if (!res.ok) throw new Error(`Dados do radar não encontrados para ${club.name}`);
        return res.json();
      })
      .then((json) => {
        setPlotData({ data: json.data, layout: json.layout || {} });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [club]);

  if (loading) return <p className="text-center text-gray-500 py-8">Carregando gráfico radar...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;
  if (!plotData) return null;

  return (
    <div style={{ minHeight: 500 }}>
      <PlotlyChart
        data={plotData.data}
        layout={{
          ...plotData.layout,
          autosize: true,
        }}
      />
    </div>
  );
}
