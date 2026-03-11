"use client";

import { useEffect, useState } from "react";
import { Club, getSankeyUrl } from "@/lib/clubs";
import PlotlyChart from "./PlotlyChart";

interface SankeyChartProps {
  club: Club;
}

export default function SankeyChart({ club }: SankeyChartProps) {
  const [plotData, setPlotData] = useState<{ data: any[]; layout: Record<string, any> } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setPlotData(null);

    fetch(getSankeyUrl(club))
      .then((res) => {
        if (!res.ok) throw new Error(`Dados não encontrados para ${club.name}`);
        return res.json();
      })
      .then((json) => {
        const layout = json.layout || {};
        // Remove any existing title from JSON to avoid overlap
        delete layout.title;
        // Increase top margin to prevent annotations from being cut off
        layout.margin = { ...(layout.margin || {}), t: 120, l: 30, r: 30, b: 30 };
        setPlotData({ data: json.data, layout });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [club]);

  if (loading) return <p className="text-center text-gray-500 py-8">Carregando diagrama Sankey...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;
  if (!plotData) return null;

  return (
    <div>
      <div className="text-center mb-2">
        <p style={{ fontSize: 25, fontWeight: "bold" }}>{club.name}</p>
        <p style={{ fontSize: 20 }}>Demonstração de Resultado</p>
      </div>
      <div style={{  }}>
        <PlotlyChart
          data={plotData.data}
          layout={{
            ...plotData.layout,
            autosize: true,
          }}
        />
      </div>
    </div>
  );
}
