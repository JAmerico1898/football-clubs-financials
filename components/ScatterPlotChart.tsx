"use client";

import { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
import {
  clubs2024,
  extraChartClubs,
  getIconUrl,
  type ScatterPeriod,
  getScatterCsvUrls,
  type Club,
} from "@/lib/clubs";
import { clubs2025 } from "@/lib/clubs2025";
import { Metric, formatValue, formatAxisValue } from "@/lib/metric-config";
import { getAxisTitle } from "@/lib/scatter-config";
import { linearRegression, pearsonR, Point } from "@/lib/regression";
import PlotlyChart from "./PlotlyChart";
import { useThemeColors } from "@/lib/useThemeColors";

interface ScatterPlotChartProps {
  xMetric: Metric;
  yMetric: Metric;
  period: ScatterPeriod;
}

interface ClubPoint {
  club: Club;
  x: number;
  y: number;
}

interface CombinedPoint {
  clubName: string;
  year: string;
  x: number;
  y: number;
}

interface CsvData {
  header: string[];
  rows: string[][];
}

export default function ScatterPlotChart({
  xMetric,
  yMetric,
  period,
}: ScatterPlotChartProps) {
  const colors = useThemeColors();
  const [csvMap, setCsvMap] = useState<Record<string, CsvData> | null>(null);

  useEffect(() => {
    const urls = getScatterCsvUrls(period);
    Promise.all(
      urls.map((url) =>
        fetch(url)
          .then((r) => r.text())
          .then((text) => {
            const clean = text.replace(/^\uFEFF/, "");
            const parsed = Papa.parse<string[]>(clean, { header: false });
            const rows = parsed.data;
            // Extract year from URL: "Índices_2024.csv" → "2024"
            const yearMatch = url.match(/(\d{4})\.csv$/);
            const year = yearMatch ? yearMatch[1] : "unknown";
            return { year, header: rows[0] || [], rows };
          })
      )
    ).then((results) => {
      const map: Record<string, CsvData> = {};
      for (const r of results) {
        map[r.year] = { header: r.header, rows: r.rows };
      }
      setCsvMap(map);
    });
  }, [period]);

  const isCombined = period === "2025 & 2024";

  // Single-season mode data
  const singleResult = useMemo(() => {
    if (isCombined || !csvMap) return null;
    const year = period;
    const csv = csvMap[year];
    if (!csv || csv.header.length === 0) return null;

    const clubList =
      year === "2025" ? clubs2025 : [...clubs2024, ...extraChartClubs];
    const extraNames = new Set(extraChartClubs.map((c) => c.name));

    const xRow = csv.rows.find((row) => row[2]?.trim() === xMetric.csvKey);
    const yRow = csv.rows.find((row) => row[2]?.trim() === yMetric.csvKey);
    if (!xRow || !yRow) return { clubPoints: null as ClubPoint[] | null, missingClubs: [] as string[] };

    const points: ClubPoint[] = [];
    const missing: string[] = [];
    for (const c of clubList) {
      const colIdx = csv.header.findIndex((h) => h.trim() === c.csvColumn);
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
  }, [csvMap, xMetric, yMetric, period, isCombined]);

  // Combined mode data
  const combinedResult = useMemo(() => {
    if (!isCombined || !csvMap) return null;

    const yearConfigs: { year: string; clubs: Club[] }[] = [
      { year: "2025", clubs: clubs2025 },
      { year: "2024", clubs: [...clubs2024, ...extraChartClubs] },
    ];

    const extraNames = new Set(extraChartClubs.map((c) => c.name));
    const points2025: CombinedPoint[] = [];
    const points2024: CombinedPoint[] = [];
    const missing: string[] = [];

    for (const { year, clubs } of yearConfigs) {
      const csv = csvMap[year];
      if (!csv || csv.header.length === 0) continue;

      const xRow = csv.rows.find((row) => row[2]?.trim() === xMetric.csvKey);
      const yRow = csv.rows.find((row) => row[2]?.trim() === yMetric.csvKey);
      if (!xRow || !yRow) continue;

      const target = year === "2025" ? points2025 : points2024;

      for (const c of clubs) {
        const colIdx = csv.header.findIndex((h) => h.trim() === c.csvColumn);
        if (colIdx < 0) continue;
        const xVal = parseFloat(xRow[colIdx]);
        const yVal = parseFloat(yRow[colIdx]);
        const isExtra = extraNames.has(c.name);
        if (isNaN(xVal) || isNaN(yVal) || (isExtra && (xVal === 0 || yVal === 0))) {
          missing.push(`${c.name} (${year})`);
          continue;
        }
        target.push({ clubName: c.name, year, x: xVal, y: yVal });
      }
    }

    return { points2025, points2024, missingClubs: missing };
  }, [csvMap, xMetric, yMetric, isCombined]);

  if (csvMap === null) return null;

  // --- Single-season rendering ---
  if (!isCombined) {
    if (!singleResult) return null;
    const { clubPoints, missingClubs } = singleResult;

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

    const iconSizeX = xRange * 0.0752;
    const iconSizeY = yRange * 0.1128;

    const hoverTrace = {
      x: clubPoints.map((cp) => cp.x),
      y: clubPoints.map((cp) => cp.y),
      mode: "markers" as const,
      type: "scatter" as const,
      marker: { size: 24, opacity: 0 },
      text: clubPoints.map((cp) => cp.club.name),
      hovertemplate: clubPoints.map(
        (cp) =>
          `<b>${cp.club.name}</b><br>${xMetric.label}: ${formatValue(cp.x, xMetric.format)}<br>${yMetric.label}: ${formatValue(cp.y, yMetric.format)}<extra></extra>`
      ),
      showlegend: false,
    };

    const regressionTrace = {
      x: [lineX0, lineX1],
      y: [slope * lineX0 + intercept, slope * lineX1 + intercept],
      mode: "lines" as const,
      type: "scatter" as const,
      line: { color: colors.textSecondary, width: 2, dash: "dash" as const },
      hoverinfo: "skip" as const,
      showlegend: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any[] = [regressionTrace, hoverTrace];

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

    const xTicks = generateTicks(xMin, xMax, 6);
    const yTicks = generateTicks(yMin, yMax, 6);
    const xTitle = getAxisTitle(xMetric);
    const yTitle = getAxisTitle(yMetric);

    const layout = {
      title: {
        text: `${yMetric.label} vs. ${xMetric.label} — ${period}`,
        font: { size: 18 },
      },
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
      font: {
        family: "Inter, system-ui, sans-serif",
        color: colors.textPrimary,
      },
      colorway: [colors.brandBlue, colors.brandRed, colors.brandGreen, colors.brandGold],
      xaxis: {
        title: { text: xTitle },
        tickvals: xTicks,
        ticktext: xTicks.map((v) => formatAxisValue(v, xMetric.format)),
        range: [xMin - xRange * 0.08, xMax + xRange * 0.08],
        gridcolor: colors.border,
        zerolinecolor: colors.border,
      },
      yaxis: {
        title: { text: yTitle },
        tickvals: yTicks,
        ticktext: yTicks.map((v) => formatAxisValue(v, yMetric.format)),
        range: [yMin - yRange * 0.1, yMax + yRange * 0.1],
        gridcolor: colors.border,
        zerolinecolor: colors.border,
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
          font: { size: 14, color: colors.textSecondary },
          bgcolor: colors.surface,
          bordercolor: colors.border,
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
              <p key={name} className="text-xs italic" style={{ color: "var(--text-secondary)" }}>
                {name} não reportou esse dado em suas Demonstrações Financeiras publicadas.
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- Combined mode rendering ---
  if (!combinedResult) return null;
  const { points2025, points2024, missingClubs } = combinedResult;
  const allCombined = [...points2025, ...points2024];

  if (allCombined.length < 3) {
    return (
      <p className="text-center text-yellow-600 mt-8">
        Dados insuficientes para calcular a regressão.
      </p>
    );
  }

  const regPoints: Point[] = allCombined.map((p) => ({ x: p.x, y: p.y }));
  const { slope, intercept } = linearRegression(regPoints);
  const r = pearsonR(regPoints);
  const r2 = r * r;

  const allX = allCombined.map((p) => p.x);
  const allY = allCombined.map((p) => p.y);
  const xMin = Math.min(...allX);
  const xMax = Math.max(...allX);
  const xRange = xMax - xMin || 1;
  const yMin = Math.min(...allY);
  const yMax = Math.max(...allY);
  const yRange = yMax - yMin || 1;

  const lineX0 = xMin - xRange * 0.05;
  const lineX1 = xMax + xRange * 0.05;

  const makeTrace = (pts: CombinedPoint[], color: string, name: string) => ({
    x: pts.map((p) => p.x),
    y: pts.map((p) => p.y),
    mode: "markers" as const,
    type: "scatter" as const,
    marker: { size: 10, color },
    name,
    hovertemplate: pts.map(
      (p) =>
        `<b>${p.clubName}</b> (${p.year})<br>${xMetric.label}: ${formatValue(p.x, xMetric.format)}<br>${yMetric.label}: ${formatValue(p.y, yMetric.format)}<extra></extra>`
    ),
  });

  const trace2025 = makeTrace(points2025, colors.brandBlue, "2025");
  const trace2024 = makeTrace(points2024, colors.brandRed, "2024");

  const regressionTrace = {
    x: [lineX0, lineX1],
    y: [slope * lineX0 + intercept, slope * lineX1 + intercept],
    mode: "lines" as const,
    type: "scatter" as const,
    line: { color: colors.textSecondary, width: 2, dash: "dash" as const },
    hoverinfo: "skip" as const,
    showlegend: false,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[] = [regressionTrace, trace2025, trace2024];

  const xTicks = generateTicks(xMin, xMax, 6);
  const yTicks = generateTicks(yMin, yMax, 6);
  const xTitle = getAxisTitle(xMetric);
  const yTitle = getAxisTitle(yMetric);

  const layout = {
    title: {
      text: `${yMetric.label} vs. ${xMetric.label} — 2025 & 2024`,
      font: { size: 18 },
    },
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    font: {
      family: "Inter, system-ui, sans-serif",
      color: colors.textPrimary,
    },
    colorway: [colors.brandBlue, colors.brandRed, colors.brandGreen, colors.brandGold],
    xaxis: {
      title: { text: xTitle },
      tickvals: xTicks,
      ticktext: xTicks.map((v) => formatAxisValue(v, xMetric.format)),
      range: [xMin - xRange * 0.08, xMax + xRange * 0.08],
      gridcolor: colors.border,
      zerolinecolor: colors.border,
    },
    yaxis: {
      title: { text: yTitle },
      tickvals: yTicks,
      ticktext: yTicks.map((v) => formatAxisValue(v, yMetric.format)),
      range: [yMin - yRange * 0.1, yMax + yRange * 0.1],
      gridcolor: colors.border,
      zerolinecolor: colors.border,
    },
    images: [],
    showlegend: true,
    annotations: [
      {
        x: 0.02,
        y: 0.98,
        xref: "paper",
        yref: "paper",
        text: `R² = ${r2.toFixed(2)}  |  r = ${r.toFixed(2)}<br><sub>Regressão calculada sobre 2025 e 2024 combinados</sub>`,
        showarrow: false,
        font: { size: 14, color: colors.textSecondary },
        bgcolor: colors.surface,
        bordercolor: colors.border,
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
            <p key={name} className="text-xs italic" style={{ color: "var(--text-secondary)" }}>
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
