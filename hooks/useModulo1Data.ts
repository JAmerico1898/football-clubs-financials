"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  Club,
  Season,
  getSankeyUrl,
  getRadarUrl,
  getSummaryUrl,
  getBarChartCsvUrl,
} from "@/lib/clubs";
import { metrics } from "@/lib/bar-chart-config";

export interface BarDatum {
  label: string;
  valCurrent: number;
  valPrior: number;
  category: string;
}

export interface Modulo1Data {
  resumoHtml: string | null;
  resumoLoading: boolean;

  sankeyData: { data: any[]; layout: Record<string, any> } | null;
  sankeyError: string | null;
  sankeyLoading: boolean;

  radarData: { data: any[]; layout: Record<string, any> } | null;
  radarError: string | null;
  radarLoading: boolean;

  barData: BarDatum[] | null;
  barError: string | null;
  barLoading: boolean;
  barNoPriorData: boolean;
}

export function useModulo1Data(club: Club | null, season: Season): Modulo1Data {
  const [resumoHtml, setResumoHtml] = useState<string | null>(null);
  const [resumoLoading, setResumoLoading] = useState(false);

  const [sankeyData, setSankeyData] = useState<Modulo1Data["sankeyData"]>(null);
  const [sankeyError, setSankeyError] = useState<string | null>(null);
  const [sankeyLoading, setSankeyLoading] = useState(false);

  const [radarData, setRadarData] = useState<Modulo1Data["radarData"]>(null);
  const [radarError, setRadarError] = useState<string | null>(null);
  const [radarLoading, setRadarLoading] = useState(false);

  const [barData, setBarData] = useState<BarDatum[] | null>(null);
  const [barError, setBarError] = useState<string | null>(null);
  const [barLoading, setBarLoading] = useState(false);
  const [barNoPriorData, setBarNoPriorData] = useState(false);

  // Resumo
  useEffect(() => {
    if (!club) { setResumoHtml(null); return; }
    setResumoLoading(true);
    setResumoHtml(null);
    fetch(getSummaryUrl(club, season))
      .then((res) => (res.ok ? res.text() : null))
      .then((text) => setResumoHtml(text))
      .catch(() => setResumoHtml(null))
      .finally(() => setResumoLoading(false));
  }, [club, season]);

  // Sankey
  useEffect(() => {
    if (!club) { setSankeyData(null); setSankeyError(null); return; }
    setSankeyLoading(true);
    setSankeyError(null);
    setSankeyData(null);
    fetch(getSankeyUrl(club, season))
      .then((res) => {
        if (!res.ok) throw new Error(`Dados não encontrados para ${club.name}`);
        return res.json();
      })
      .then((json) => {
        const layout = json.layout || {};
        delete layout.title;
        layout.margin = { ...(layout.margin || {}), t: 120, l: 30, r: 30, b: 30 };
        setSankeyData({ data: json.data, layout });
      })
      .catch((err) => setSankeyError(err.message))
      .finally(() => setSankeyLoading(false));
  }, [club, season]);

  // Radar
  useEffect(() => {
    if (!club) { setRadarData(null); setRadarError(null); return; }
    setRadarLoading(true);
    setRadarError(null);
    setRadarData(null);
    fetch(getRadarUrl(club, season))
      .then((res) => {
        if (!res.ok) throw new Error(`Dados do radar não encontrados para ${club.name}`);
        return res.json();
      })
      .then((json) => setRadarData({ data: json.data, layout: json.layout || {} }))
      .catch((err) => setRadarError(err.message))
      .finally(() => setRadarLoading(false));
  }, [club, season]);

  // Bar chart
  useEffect(() => {
    if (!club) { setBarData(null); setBarError(null); setBarNoPriorData(false); return; }
    setBarLoading(true);
    setBarError(null);
    setBarData(null);
    setBarNoPriorData(false);

    fetch(getBarChartCsvUrl(season))
      .then((res) => {
        if (!res.ok) throw new Error("Não foi possível carregar os dados CSV");
        return res.text();
      })
      .then((csvText) => {
        const parsed = Papa.parse(csvText, { header: false, skipEmptyLines: true });
        const rows = parsed.data as string[][];
        const header = rows[0];
        const colIdx = header.indexOf(club.csvColumn);

        if (colIdx === -1) {
          throw new Error(`Coluna "${club.csvColumn}" não encontrada no CSV`);
        }

        const result: BarDatum[] = metrics.map((m) => ({
          label: m.label,
          valCurrent: parseFloat(rows[m.rowCurrent + 1]?.[colIdx] || "0") || 0,
          valPrior: parseFloat(rows[m.rowPrior + 1]?.[colIdx] || "0") || 0,
          category: m.category,
        }));

        // Check if all prior values are zero (club may not have existed in prior season)
        const allPriorZero = result.every((d) => d.valPrior === 0);
        setBarNoPriorData(allPriorZero);
        setBarData(result);
      })
      .catch((err) => setBarError(err.message))
      .finally(() => setBarLoading(false));
  }, [club, season]);

  return {
    resumoHtml,
    resumoLoading,
    sankeyData,
    sankeyError,
    sankeyLoading,
    radarData,
    radarError,
    radarLoading,
    barData,
    barError,
    barLoading,
    barNoPriorData,
  };
}
