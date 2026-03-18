"use client";

import { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
import { Club, clubs2024, extraChartClubs, getIconUrl } from "@/lib/clubs";
import { clubs2025 } from "@/lib/clubs2025";
import { Metric, formatValue, formatAxisValue } from "@/lib/metric-config";
import { getAxisTitle } from "@/lib/scatter-config";
import { linearRegression, pearsonR, Point } from "@/lib/regression";
import PlotlyChart from "./PlotlyChart";

export type ScatterPeriod = "2025" | "2024" | "both";

interface ScatterPlotChartProps {
  xMetric: Metric;
  yMetric: Metric;
  period: ScatterPeriod;
  selectedClub: string | null;
}

interface ClubPoint {
  club: Club;
  x: number;
  y: number;
  year?: string;
}

function parseCSV(text: string): { header: string[]; rows: string[][] } {
  const clean = text.replace(/^\uFEFF/, "");
  const parsed = Papa.parse<string[]>(clean, { header: false });
  const rows = parsed.data;
  if (rows.length === 0) return { header: [], rows: [] };
  return { header: rows[0], rows };
}

function extractPoints(
  header: string[],
  rows: string[][],
  clubList: Club[],
  extraNames: Set<string>,
  xMetric: Metric,
  yMetric: Metric,
  year?: string,
): { points: ClubPoint[]; missing: string[] } {
  const xRow = rows.find((row) => row[2]?.trim() === xMetric.csvKey);
  const yRow = rows.find((row) => row[2]?.trim() === yMetric.csvKey);

  if (!xRow || !yRow) return { points: [], missing: [] };

  const points: ClubPoint[] = [];
  const missing: string[] = [];

  for (const c of clubList) {
    const colIdx = header.findIndex((h) => h.trim() === c.csvColumn);
    if (colIdx < 0) continue;
    const xVal = parseFloat(xRow[colIdx]);
    const yVal = parseFloat(yRow[colIdx]);
    const isExtra = extraNames.has(c.name);
    if (isNaN(xVal) || isNaN(yVal) || (isExtra && (xVal === 0 || yVal === 0))) {
      missing.push(c.name);
      continue;
    }
    points.push({ club: c, x: xVal, y: yVal, year });
  }
  return { points, missing };
}

export default function ScatterPlotChart({
  xMetric,
  yMetric,
  period,
  selectedClub,
}: ScatterPlotChartProps) {
  const [csv2024, setCsv2024] = useState<{ header: string[]; rows: string[][] } | null>(null);
  const [csv2025, setCsv2025] = useState<{ header: string[]; rows: string[][] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setCsv2024(null);
    setCsv2025(null);

    const fetches: Promise<void>[] = [];

    if (period === "2024" || period === "both") {
      fetches.push(
        fetch("/data/Índices_2024.csv")
          .then((r) => r.text())
          .then((text) => setCsv2024(parseCSV(text)))
      );
    }

    if (period === "2025" || period === "both") {
      fetches.push(
        fetch("/data/Índices_2025.csv")
          .then((r) => r.text())
          .then((text) => setCsv2025(parseCSV(text)))
      );
    }

    Promise.all(fetches).then(() => setLoading(false));
  }, [period]);

  const { clubPoints, missingClubs } = useMemo(() => {
    const extraNames = new Set(extraChartClubs.map((c) => c.name));
    const allPoints: ClubPoint[] = [];
    const allMissing: string[] = [];

    if ((period === "2024" || period === "both") && csv2024) {
      const clubs = [...clubs2024, ...extraChartClubs];
      const { points, missing } = extractPoints(
        csv2024.header, csv2024.rows, clubs, extraNames, xMetric, yMetric, "2024"
      );
      allPoints.push(...points);
      allMissing.push(...missing);
    }

    if ((period === "2025" || period === "both") && csv2025) {
      const clubs = [...clubs2025, ...extraChartClubs];
      const { points, missing } = extractPoints(
        csv2025.header, csv2025.rows, clubs, extraNames, xMetric, yMetric, "2025"
      );
      allPoints.push(...points);
      allMissing.push(...missing);
    }

    // Deduplicate missing names
    const uniqueMissing = [...new Set(allMissing)];
    return { clubPoints: allPoints.length > 0 ? allPoints : null, missingClubs: uniqueMissing };
  }, [csv2024, csv2025, period, xMetric, yMetric]);

  if (loading) return null;

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

  const regressionPoints: Point[] = clubPoints.map((cp) => ({ x: cp.x, y: cp.y }));
  const { slope, intercept } = linearRegression(regressionPoints);
  const r = pearsonR(regressionPoints);
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

  // Build tick values/text for axes
  const xTicks = generateTicks(xMin, xMax, 6);
  const yTicks = generateTicks(yMin, yMax, 6);
  const xTitle = getAxisTitle(xMetric);
  const yTitle = getAxisTitle(yMetric);

  const isCombined = period === "both";

  // Chart title
  const periodLabel = period === "both" ? "2025 & 2024" : period;
  const chartTitle = `${yMetric.label} vs. ${xMetric.label} — ${periodLabel}`;

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
  const data: any[] = [regressionTrace];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let images: any[] = [];

  if (isCombined) {
    // Combined mode: colored dots, no badges
    const BLUE = "#1565C0";
    const ORANGE = "#E65100";

    const points2025 = clubPoints.filter((cp) => cp.year === "2025");
    const points2024 = clubPoints.filter((cp) => cp.year === "2024");

    const makeTrace = (pts: ClubPoint[], year: string, color: string) => ({
      x: pts.map((cp) => cp.x),
      y: pts.map((cp) => cp.y),
      mode: "markers" as const,
      type: "scatter" as const,
      name: year,
      marker: {
        size: pts.map((cp) => (cp.club.name === selectedClub ? 16 : 10)),
        color,
        line: {
          color: pts.map((cp) => (cp.club.name === selectedClub ? "#000" : color)),
          width: pts.map((cp) => (cp.club.name === selectedClub ? 2 : 0)),
        },
      },
      text: pts.map((cp) => cp.club.name),
      hovertemplate: pts.map(
        (cp) =>
          `<b>${cp.club.name}</b> (${year})<br>${xMetric.label}: ${formatValue(cp.x, xMetric.format)}<br>${yMetric.label}: ${formatValue(cp.y, yMetric.format)}<extra></extra>`
      ),
    });

    data.push(makeTrace(points2025, "2025", BLUE));
    data.push(makeTrace(points2024, "2024", ORANGE));
  } else {
    // Single season mode: badge icons
    const iconSizeX = xRange * 0.06;
    const iconSizeY = yRange * 0.09;

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

    data.push(hoverTrace);

    // Club icon images
    images = clubPoints.map((cp) => {
      const isSelected = cp.club.name === selectedClub;
      const scale = isSelected ? 1.5 : 1;
      return {
        source: getIconUrl(cp.club),
        xref: "x",
        yref: "y",
        x: cp.x,
        y: cp.y,
        sizex: iconSizeX * scale,
        sizey: iconSizeY * scale,
        xanchor: "center",
        yanchor: "middle",
        sizing: "contain",
        layer: "above",
      };
    });
  }

  // Annotations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const annotations: any[] = [
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
  ];

  if (isCombined) {
    annotations.push({
      x: 0.02,
      y: 0.88,
      xref: "paper",
      yref: "paper",
      text: "Regressão calculada sobre 2025 e 2024 combinados",
      showarrow: false,
      font: { size: 11, color: "#666", style: "italic" },
      bgcolor: "rgba(255,255,255,0.85)",
      xanchor: "left",
      yanchor: "top",
    });
  }

  const layout = {
    title: {
      text: chartTitle,
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
    annotations,
    margin: { t: 60, r: 30, b: 60, l: 80 },
    hovermode: "closest",
    showlegend: isCombined,
    legend: isCombined
      ? { x: 0.98, y: 0.98, xanchor: "right", yanchor: "top", bgcolor: "rgba(255,255,255,0.85)" }
      : undefined,
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
