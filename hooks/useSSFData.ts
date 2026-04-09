"use client";

import { useEffect, useState, useCallback } from "react";
import Papa from "papaparse";
import { getIconUrl } from "@/lib/clubs";
import {
  SSF_KEYS,
  resolveSSFData,
  type SSFClubDetail,
} from "@/lib/ssf-clubs";
import { clubs2025 } from "@/lib/clubs2025";
import type { Club } from "@/lib/clubs";

export interface SSFBarDatum {
  name: string;
  value: number;
  compliant: boolean;
  iconUrl: string;
}

export interface UseSSFDataReturn {
  chartData1: SSFBarDatum[];
  chartData2: SSFBarDatum[];
  chartData3: SSFBarDatum[];
  rows: CsvRow[];
  getClubDetails: (club: Club) => SSFClubDetail | null;
  loading: boolean;
  error: string | null;
}

export type CsvRow = Record<string, string>;

function getVal(row: CsvRow | undefined, col: string): number {
  if (!row) return NaN;
  const raw = row[col]?.trim();
  if (!raw || raw === "") return NaN;
  return parseFloat(raw);
}

export function useSSFData(): UseSSFDataReturn {
  const [chartData1, setChartData1] = useState<SSFBarDatum[]>([]);
  const [chartData2, setChartData2] = useState<SSFBarDatum[]>([]);
  const [chartData3, setChartData3] = useState<SSFBarDatum[]>([]);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/SSF_2025.csv")
      .then((res) => {
        if (!res.ok) throw new Error("Não foi possível carregar SSF_2025.csv");
        return res.text();
      })
      .then((text) => {
        const clean = text.replace(/^\uFEFF/, "");
        const parsed = Papa.parse<CsvRow>(clean, {
          header: true,
          skipEmptyLines: true,
        });
        const csvRows = parsed.data;
        setRows(csvRows);

        const byDados = new Map<string, CsvRow>();
        for (const r of csvRows) {
          const key = r["Dados"]?.trim();
          if (key) byDados.set(key, r);
        }

        const rowReq1 = byDados.get(SSF_KEYS.reqSustentabilidade);
        const rowReq2 = byDados.get(SSF_KEYS.reqCustoElenco);
        const rowReq3 = byDados.get(SSF_KEYS.reqEndividamento);

        // Chart 1: Requisito de Sustentabilidade — descending
        const d1: SSFBarDatum[] = clubs2025
          .map((c) => {
            const v = getVal(rowReq1, c.csvColumn);
            if (isNaN(v)) return null;
            return {
              name: c.name,
              value: v,
              compliant: v >= 0,
              iconUrl: getIconUrl(c),
            };
          })
          .filter((x): x is SSFBarDatum => x !== null)
          .sort((a, b) => b.value - a.value);
        setChartData1(d1);

        // Chart 2: Requisito de Custo com Elenco — ascending
        const d2: SSFBarDatum[] = clubs2025
          .map((c) => {
            const v = getVal(rowReq2, c.csvColumn);
            return {
              name: c.name,
              value: isNaN(v) ? 0 : v,
              compliant: isNaN(v) ? true : v <= 0.9,
              iconUrl: getIconUrl(c),
            };
          })
          .sort((a, b) => a.value - b.value);
        setChartData2(d2);

        // Chart 3: Requisito de Endividamento — ascending
        const d3: SSFBarDatum[] = clubs2025
          .map((c) => {
            const v = getVal(rowReq3, c.csvColumn);
            return {
              name: c.name,
              value: isNaN(v) ? 0 : v,
              compliant: isNaN(v) ? true : v <= 0.7,
              iconUrl: getIconUrl(c),
            };
          })
          .sort((a, b) => a.value - b.value);
        setChartData3(d3);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const getClubDetails = useCallback(
    (club: Club): SSFClubDetail | null => {
      if (rows.length === 0) return null;
      return resolveSSFData(rows, club);
    },
    [rows]
  );

  return { chartData1, chartData2, chartData3, rows, getClubDetails, loading, error };
}
