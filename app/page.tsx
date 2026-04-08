import fs from "fs";
import path from "path";
import Papa from "papaparse";
import Image from "next/image";
import Link from "next/link";
import { landingCards, spiralBadges } from "@/lib/landing-cards";
import type { LandingCard } from "@/lib/landing-cards";

const CLUBS_2025_CSV = new Set([
  "Vasco","Atlético","Bahia","Botafogo","Ceará","Corinthians","Cruzeiro",
  "Flamengo","Fluminense","Fortaleza","Grêmio","Internacional","Juventude",
  "Mirassol","Palmeiras","Santos","São Paulo","Sport","Red Bull Bragantino","Vitória",
]);

function computeFooterKPIs() {
  const dataDir = path.join(process.cwd(), "public", "data");

  // --- índices_2025.csv ---
  const indicesRaw = fs.readFileSync(path.join(dataDir, "índices_2025.csv"), "utf-8").replace(/^\uFEFF/, "");
  const indicesRows = indicesRaw.split("\n").map((r) => r.split(","));
  const indicesHeader = indicesRows[0];

  const clubCols: number[] = [];
  for (let i = 3; i < indicesHeader.length - 1; i++) {
    if (CLUBS_2025_CSV.has(indicesHeader[i]?.trim())) clubCols.push(i);
  }

  function sumRow(rowName: string): number {
    const row = indicesRows.find((r) => r[2]?.trim() === rowName);
    if (!row) return 0;
    return clubCols.reduce((sum, col) => sum + (parseFloat(row[col]) || 0), 0);
  }

  const receita = sumRow("Receita Operacional");
  const custo = sumRow("Custo da Atividade Esportiva");
  const divida = sumRow("Dívida Líquida");

  // --- Transparência.csv ---
  const transpRaw = fs.readFileSync(path.join(dataDir, "Transparência.csv"), "utf-8").replace(/^\uFEFF/, "");
  const parsed = Papa.parse(transpRaw, { header: false, skipEmptyLines: true });
  const transpRows = parsed.data as string[][];
  const transpHeader = transpRows[0];

  const transpClubCols: number[] = [];
  for (let i = 3; i < transpHeader.length; i++) {
    const name = transpHeader[i]?.trim();
    if (name && name !== "Média da Liga" && CLUBS_2025_CSV.has(name)) transpClubCols.push(i);
  }

  const clubTotals: Record<number, number> = {};
  for (const col of transpClubCols) clubTotals[col] = 0;

  for (let r = 1; r < transpRows.length; r++) {
    const nivel = (transpRows[r][1] || "").trim();
    if (!nivel.startsWith("Nível")) continue;
    for (const col of transpClubCols) {
      const val = parseFloat((transpRows[r][col] || "").replace(",", "."));
      if (!isNaN(val)) clubTotals[col] += val;
    }
  }

  const totals = Object.values(clubTotals);
  const clubsWithData = totals.filter((t) => t !== 0);
  const meanTransp = clubsWithData.length > 0
    ? clubsWithData.reduce((a, b) => a + b, 0) / clubsWithData.length
    : 0;

  return { receita, custo, divida, meanTransp };
}

function formatBRL(millions: number): string {
  const abs = Math.abs(millions);
  if (abs >= 1000) return `R$ ${(abs / 1000).toFixed(1)} Bi`;
  return `R$ ${abs.toFixed(0)} Mi`;
}

function LandingCardComponent({ card }: { card: LandingCard }) {
  return (
    <Link href={card.href}>
      <article className="glass-card p-8 rounded hover:shadow-xl transition-all duration-300 flex flex-col group ghost-border shadow-sm">
        <div className="data-ribbon" />
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-[#115cb9] text-2xl">
            {card.materialIcon}
          </span>
          <h3 className="font-headline font-bold text-lg text-[#2b3437]">
            {card.title}
          </h3>
        </div>
        <p className="text-[#586064] leading-relaxed text-sm">
          {card.description}
        </p>
      </article>
    </Link>
  );
}

export default function FrontPage() {
  const { receita, custo, divida, meanTransp } = computeFooterKPIs();

  return (
    <>
      {/* Fixed grass background + green overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/grass-bg.jpg"
          alt="Grass Texture Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 full-page-bg-overlay" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="px-8 lg:px-24 pt-16 pb-12 max-w-screen-2xl mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="max-w-3xl flex items-center gap-6">
              <div>
                <h1 className="font-headline font-extrabold text-5xl lg:text-6xl tracking-tight leading-tight mb-4 text-white">
                  Almanaque Financeiro <br />
                  <span className="text-white font-bold">da Série A - 2025</span>
                </h1>
                <p className="font-body text-white/90 text-xl tracking-wide">
                  Explore as finanças dos clubes do Brasileirão.
                </p>
                <div className="mt-12 flex justify-center md:justify-start">
                  <Image
                    src="/brasileirao-logo.jpg"
                    alt="Brasileirão Badge"
                    width={176}
                    height={176}
                    className="h-32 lg:h-44 w-auto object-contain mx-auto md:ml-56 md:mr-0"
                  />
                </div>
              </div>
            </div>

            {/* Spiral Badges — desktop only */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="spiral-container">
                {spiralBadges.map((badge) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={badge.alt}
                    alt={badge.alt}
                    src={`/clubs_frontpage/${badge.file}`}
                    className="spiral-badge aspect-square"
                    style={{
                      width: `${badge.width}px`,
                      top: badge.top,
                      left: badge.left,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cards Grid: 2-3-2 Layout */}
        <main className="flex-grow px-8 lg:px-24 py-12 max-w-screen-2xl mx-auto w-full">
          <div className="space-y-6">
            {/* Row 1: 2 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {landingCards.slice(0, 2).map((card) => (
                <LandingCardComponent key={card.href} card={card} />
              ))}
            </div>
            {/* Row 2: 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {landingCards.slice(2, 5).map((card) => (
                <LandingCardComponent key={card.href} card={card} />
              ))}
            </div>
            {/* Row 3: 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {landingCards.slice(5, 8).map((card) => (
                <LandingCardComponent key={card.href} card={card} />
              ))}
            </div>
          </div>
        </main>

        {/* Footer with KPIs */}
        <footer className="glass-footer tonal-transition w-full py-8 mt-auto border-t border-black/5">
          <div className="flex flex-col md:flex-row justify-between items-center px-12 max-w-screen-2xl mx-auto gap-8">
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="font-headline font-bold text-[#2b3437] uppercase tracking-widest text-xs">
                Almanaque Financeiro da Série A - 2025
              </span>
            </div>

            {/* KPIs */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <div className="flex flex-col items-center">
                <span className="font-label text-[10px] uppercase tracking-widest text-[#586064] opacity-60">
                  Faturamento Total
                </span>
                <span className="font-headline font-bold text-[#2b3437]">{formatBRL(receita)}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-label text-[10px] uppercase tracking-widest text-[#586064] opacity-60">
                  Custo Esportivo
                </span>
                <span className="font-headline font-bold text-[#2b3437]">{formatBRL(custo)}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-label text-[10px] uppercase tracking-widest text-[#586064] opacity-60">
                  Transparência
                </span>
                <span className="font-headline font-bold text-[#115cb9]">{meanTransp.toFixed(1)}/19</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-label text-[10px] uppercase tracking-widest text-[#586064] opacity-60">
                  Endividamento
                </span>
                <span className="font-headline font-bold text-[#9f403d]">{formatBRL(divida)}</span>
              </div>
            </div>

            {/* Contact link */}
            <div>
              <Link
                href="/contato"
                className="font-headline text-xs tracking-wider uppercase text-[#115cb9] font-semibold hover:opacity-80 transition-opacity duration-200"
              >
                Dúvidas? Sugestões?<br />Entre em contato!
              </Link>
            </div>
          </div>
        </footer>
      </div>

      {/* Hidden visit counter */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Ffinancials-football-clubs.vercel.app&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=visits&edge_flat=false"
        alt=""
        style={{ display: "none" }}
      />
    </>
  );
}
