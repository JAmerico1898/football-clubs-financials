"use client";

import { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
import { allChartClubs, extraChartClubs, getIconUrl } from "@/lib/clubs";
import { Metric, formatValue, formatAxisValue } from "@/lib/metric-config";
import { getAxisTitle } from "@/lib/scatter-config";
import { linearRegression, pearsonR, Point } from "@/lib/regression";
import PlotlyChart from "./PlotlyChart";

interface ScatterPlotChartProps {
  xMetric: Metric;
  yMetric: Metric;
}

interface ClubPoint {
  club: (typeof allChartClubs)[number];
  x: number;
  y: number;
}

export default function ScatterPlotChart({
  xMetric,
  yMetric,
}: ScatterPlotChartProps) {
  const [csvRows, setCsvRows] = useState<string[][] | null>(null);
  const [header, setHeader] = useState<string[]>([]);

  useEffect(() => {
    fetch("/data/Índices.csv")
      .then((r) => r.text())
      .then((text) => {
        const clean = text.replace(/^\uFEFF/, "");
        const parsed = Papa.parse<string[]>(clean, { header: false });
        const rows = parsed.data;
        if (rows.length === 0) return;
        setHeader(rows[0]);
        setCsvRows(rows);
      });
  }, []);

  const { clubPoints, missingClubs } = useMemo(() => {
    if (!csvRows || header.length === 0) return { clubPoints: null, missingClubs: [] };

    const xRow = csvRows.find((row) => row[2]?.trim() === xMetric.csvKey);
    const yRow = csvRows.find((row) => row[2]?.trim() === yMetric.csvKey);

    if (!xRow || !yRow) return { clubPoints: null, missingClubs: [] };

    const extraNames = new Set(extraChartClubs.map((c) => c.name));
    const points: ClubPoint[] = [];
    const missing: string[] = [];
    for (const c of allChartClubs) {
      const colIdx = header.findIndex((h) => h.trim() === c.csvColumn);
      if (colIdx < 0) continue;
      const xVal = parseFloat(xRow[colIdx]);
      const yVal = parseFloat(yRow[colIdx]);
      const isExtra = extraNames.has(c.name);
      if (isNaN(xVal) || isNaN(yVal) || (isExtra && (xVal === 0 || yVal === 0))) {
        missing.push(c.name);
        continue;
      }
      points.push({ club: c, x: xVal, y: yVal });
    }
    return { clubPoints: points, missingClubs: missing };
  }, [csvRows, header, xMetric, yMetric]);

  if (csvRows === null) return null;

  if (!clubPoints) {
    return (
      <p className="text-center text-red-500 mt-8">
        Métrica não encontrada no CSV.
      </p>
    );
  }

  if (clubPoints.length < 3) {
    return (
      <p className="text-center text-yellow-600 mt-8">
        Dados insuficientes para calcular a regressão.
      </p>
    );
  }

  const points: Point[] = clubPoints.map((cp) => ({ x: cp.x, y: cp.y }));
  const { slope, intercept } = linearRegression(points);
  const r = pearsonR(points);
  const r2 = r * r;

  const xValues = clubPoints.map((cp) => cp.x);
  const yValues = clubPoints.map((cp) => cp.y);
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const xRange = xMax - xMin || 1;
  const lineX0 = xMin - xRange * 0.05;
  const lineX1 = xMax + xRange * 0.05;

  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  const yRange = yMax - yMin || 1;

  // Uniform icon size in axis units
  const iconSizeX = xRange * 0.045;
  const iconSizeY = yRange * 0.07;

  // Invisible scatter trace for hover
  const hoverTrace = {
    x: clubPoints.map((cp) => cp.x),
    y: clubPoints.map((cp) => cp.y),
    mode: "markers" as const,
    type: "scatter" as const,
    marker: {
      size: 24,
      opacity: 0,
    },
    text: clubPoints.map((cp) => cp.club.name),
    hovertemplate: clubPoints.map(
      (cp) =>
        `<b>${cp.club.name}</b><br>${xMetric.label}: ${formatValue(cp.x, xMetric.format)}<br>${yMetric.label}: ${formatValue(cp.y, yMetric.format)}<extra></extra>`
    ),
    showlegend: false,
  };

  // Regression line trace
  const regressionTrace = {
    x: [lineX0, lineX1],
    y: [slope * lineX0 + intercept, slope * lineX1 + intercept],
    mode: "lines" as const,
    type: "scatter" as const,
    line: { color: "#555", width: 2, dash: "dash" as const },
    hoverinfo: "skip" as const,
    showlegend: false,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[] = [regressionTrace, hoverTrace];

  // Club icon images — all same size
  const images = clubPoints.map((cp) => ({
    source: getIconUrl(cp.club),
    xref: "x",
    yref: "y",
    x: cp.x,
    y: cp.y,
    sizex: iconSizeX,
    sizey: iconSizeY,
    xanchor: "center",
    yanchor: "middle",
    sizing: "contain",
    layer: "above",
  }));

  // Build tick values/text for axes
  const xTicks = generateTicks(xMin, xMax, 6);
  const yTicks = generateTicks(yMin, yMax, 6);

  const xTitle = getAxisTitle(xMetric);
  const yTitle = getAxisTitle(yMetric);

  const layout = {
    title: {
      text: `${yMetric.label} vs. ${xMetric.label}`,
      font: { size: 18 },
    },
    xaxis: {
      title: { text: xTitle },
      tickvals: xTicks,
      ticktext: xTicks.map((v) => formatAxisValue(v, xMetric.format)),
      range: [xMin - xRange * 0.08, xMax + xRange * 0.08],
    },
    yaxis: {
      title: { text: yTitle },
      tickvals: yTicks,
      ticktext: yTicks.map((v) => formatAxisValue(v, yMetric.format)),
      range: [yMin - yRange * 0.1, yMax + yRange * 0.1],
    },
    images,
    annotations: [
      {
        x: 0.02,
        y: 0.98,
        xref: "paper",
        yref: "paper",
        text: `R² = ${r2.toFixed(2)}  |  r = ${r.toFixed(2)}`,
        showarrow: false,
        font: { size: 14, color: "#333" },
        bgcolor: "rgba(255,255,255,0.85)",
        bordercolor: "#ccc",
        borderwidth: 1,
        borderpad: 6,
        xanchor: "left",
        yanchor: "top",
      },
    ],
    margin: { t: 60, r: 30, b: 60, l: 80 },
    hovermode: "closest",
  };

  return (
    <div>
      <div style={{ height: 560 }}>
        <PlotlyChart data={data} layout={layout} />
      </div>
      {missingClubs.length > 0 && (
        <div className="-mt-4 ml-[80px] space-y-0.5">
          {missingClubs.map((name) => (
            <p key={name} className="text-gray-500 text-xs italic">
              {name} não reportou esse dado em suas Demonstrações Financeiras publicadas.
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function generateTicks(min: number, max: number, count: number): number[] {
  const range = max - min;
  if (range === 0) return [min];
  const step = range / (count - 1);
  const ticks: number[] = [];
  for (let i = 0; i < count; i++) {
    ticks.push(min + step * i);
  }
  return ticks;
}
