"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import ModuleNavbar from "@/components/ModuleNavbar";
import SSFBarChart from "@/components/SSFBarChart";
import SSFDetailTable from "@/components/SSFDetailTable";
import { useSSFData } from "@/hooks/useSSFData";
import { clubs2025 } from "@/lib/clubs2025";
import { getIconUrl } from "@/lib/clubs";

const DEFAULT_CLUB = "Vasco";

function fmtBRL(v: number): string {
  return `${Math.round(v)}`;
}

function fmtPct(v: number): string {
  return `${Math.round(v * 100)}%`;
}

export default function SustentabilidadeFinanceiraPage() {
  const [selectedClubName, setSelectedClubName] = useState(DEFAULT_CLUB);
  const { chartData1, chartData2, chartData3, rows, getClubDetails, loading, error } =
    useSSFData();

  const selectedClub = useMemo(
    () => clubs2025.find((c) => c.name === selectedClubName) ?? clubs2025[0],
    [selectedClubName]
  );

  const clubDetails = useMemo(
    () => getClubDetails(selectedClub),
    [getClubDetails, selectedClub]
  );

  return (
    <>
      {/* Fixed grass background + light green overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="/grass-bg.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 light-page-bg-overlay" />
      </div>

      <main className="relative z-10 max-w-[1200px] mx-auto px-4 py-12">
      <ModuleNavbar />

      <h1
        className="text-3xl font-bold tracking-tight mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Sistema de Sustentabilidade Financeira
      </h1>

      {/* Section 1: Regulatory context */}
      <div className="card-surface mb-10">
        <p style={{ color: "var(--text-secondary)" }}>
          <strong>O Sistema de Sustentabilidade Financeira (SSF)</strong> define
          requisitos que os clubes brasileiros deverão atender a partir de 2026.
          Este módulo apresenta uma{" "}
          <strong>simulação com dados de 2025</strong> — não se trata de um
          resultado definitivo, mas de um indicativo da conformidade dos clubes
          com a regulação.
        </p>
      </div>

      {loading && (
        <p style={{ color: "var(--text-secondary)" }}>Carregando dados...</p>
      )}

      {error && (
        <p className="text-red-600 font-semibold">Erro: {error}</p>
      )}

      {!loading && !error && (
        <>
          {/* Section 2: Three charts */}
          <div className="flex flex-col gap-16">
            {/* Chart 1 */}
            <div className="card-surface">
              <SSFBarChart
                data={chartData1}
                selectedClub={selectedClubName}
                title="Requisito de Sustentabilidade — Resultado Operacional (2025)"
                concept="O Resultado Operacional corresponde à diferença entre Receitas Relevantes e Despesas Relevantes após as exclusões do Resultado da Operação."
                yLabel="Resultado Operacional (R$ milhões)"
                formatFn={fmtBRL}
                tooltipFormatFn={(v) => `R$ ${Math.round(v)} mi`}
                dashedZeroLine
                disclaimer="Nota: A simulação considera apenas o exercício de 2025. Os critérios de resultado operacional agregado dos últimos 3 exercícios não puderam ser avaliados por ausência de dados históricos comparáveis."
              />
            </div>

            {/* Chart 2 */}
            <div className="card-surface">
              <SSFBarChart
                data={chartData2}
                selectedClub={selectedClubName}
                title="Requisito de Controle de Custo com o Elenco (2025)"
                concept="O Indicador de Custo com Elenco é a razão entre o Custo com Elenco do clube e o Financiamento do Elenco. Quanto menor o indicador, maior a eficiência financeira."
                yLabel="Indicador de Custo com Elenco"
                formatFn={fmtPct}
                referenceLines={[
                  { y: 0.9, color: "#F9A825", label: "Limite 2026: 90%" },
                  { y: 0.8, color: "#E65100", label: "Limite 2027: 80%" },
                  { y: 0.7, color: "#C0392B", label: "Limite 2028: 70%" },
                ]}
              />
            </div>

            {/* Chart 3 */}
            <div className="card-surface">
              <SSFBarChart
                data={chartData3}
                selectedClub={selectedClubName}
                title="Requisito de Endividamento de Curto Prazo (2025)"
                concept="O Indicador de Endividamento de Curto Prazo é a razão entre as Obrigações Líquidas de Curto Prazo e as Receitas Relevantes. Quanto menor o indicador, menor o endividamento relativo."
                yLabel="Indicador de Endividamento de Curto Prazo"
                formatFn={fmtPct}
                referenceLines={[
                  { y: 0.7, color: "#F9A825", label: "Limite 2026: 70%" },
                  { y: 0.6, color: "#E65100", label: "Limite 2027: 60%" },
                  { y: 0.5, color: "#C0392B", label: "Limite 2028: 50%" },
                  { y: 0.45, color: "#6A0572", label: "Limite 2029+: 45%" },
                ]}
              />
            </div>
          </div>

          {/* Section 3: Club selector */}
          <div className="mt-16 mb-8">
            <h2
              className="text-xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Detalhamento por Clube
            </h2>
            <div className="flex items-center gap-4">
              <select
                className="select-themed"
                value={selectedClubName}
                onChange={(e) => setSelectedClubName(e.target.value)}
              >
                {clubs2025.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <Image
                src={getIconUrl(selectedClub)}
                alt={selectedClub.name}
                width={48}
                height={48}
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          {/* Section 4: Detail table */}
          {clubDetails ? (
            <SSFDetailTable detail={clubDetails} rows={rows} csvColumn={selectedClub.csvColumn} />
          ) : (
            <p style={{ color: "var(--text-secondary)" }}>
              Selecione um clube para ver os detalhes.
            </p>
          )}
        </>
      )}
      <ModuleNavbar />
    </main>
    </>
  );
}
